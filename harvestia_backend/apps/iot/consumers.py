"""
HARVESTIA - IoT WebSocket Consumer
Real-time bidirectional sensor data streaming
ws://domain/ws/sensors/<farm_id>/
ws://domain/ws/dashboard/<user_id>/
"""
import json
import asyncio
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.utils import timezone
from datetime import datetime
import logging

logger = logging.getLogger('harvestia.iot')


class SensorStreamConsumer(AsyncWebsocketConsumer):
    """
    WebSocket consumer for live IoT sensor data.
    Clients subscribe to a farm_id and receive updates every 5 seconds.
    Also accepts commands to control irrigation.
    """

    async def connect(self):
        self.farm_id   = self.scope['url_route']['kwargs']['farm_id']
        self.user      = self.scope['user']
        self.group_name= f'farm_{self.farm_id}_sensors'

        # Validate user has access to this farm
        has_access = await self.check_farm_access()
        if not has_access:
            await self.close(code=4003)
            return

        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

        # Send welcome + current snapshot
        snapshot = await self.get_latest_snapshot()
        await self.send(text_data=json.dumps({
            'type': 'connection_established',
            'farm_id': self.farm_id,
            'snapshot': snapshot,
            'timestamp': datetime.now().isoformat(),
        }))

        logger.info(f"WS connect: user={self.user} farm={self.farm_id}")

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)
        logger.info(f"WS disconnect: farm={self.farm_id} code={close_code}")

    async def receive(self, text_data):
        """Handle incoming messages from client (control commands)"""
        try:
            data = json.loads(text_data)
            msg_type = data.get('type')

            if msg_type == 'ping':
                await self.send(text_data=json.dumps({'type': 'pong'}))

            elif msg_type == 'subscribe_field':
                # Client subscribes to specific field
                field_id = data.get('field_id')
                self.subscribed_fields = getattr(self, 'subscribed_fields', set())
                self.subscribed_fields.add(field_id)
                await self.send(text_data=json.dumps({
                    'type': 'subscribed', 'field_id': field_id
                }))

            elif msg_type == 'irrigation_command':
                # Trigger irrigation via IoT command
                result = await self.send_irrigation_command(data)
                await self.send(text_data=json.dumps({
                    'type': 'irrigation_ack', **result
                }))

            elif msg_type == 'request_historical':
                # Last N hours of sensor data
                hours = data.get('hours', 24)
                historical = await self.get_historical_data(data.get('device_id'), hours)
                await self.send(text_data=json.dumps({
                    'type': 'historical_data',
                    'data': historical,
                }))

        except json.JSONDecodeError:
            await self.send(text_data=json.dumps({'type': 'error', 'msg': 'Invalid JSON'}))
        except Exception as e:
            logger.error(f"WS receive error: {e}")

    # ── Group message handlers ──────────────────────────────────

    async def sensor_update(self, event):
        """Broadcast sensor readings to all connected clients for this farm"""
        await self.send(text_data=json.dumps({
            'type': 'sensor_update',
            'data': event['data'],
            'timestamp': datetime.now().isoformat(),
        }))

    async def alert_triggered(self, event):
        """Push new AI alert to dashboard"""
        await self.send(text_data=json.dumps({
            'type': 'new_alert',
            'alert': event['alert'],
        }))

    async def irrigation_status(self, event):
        """Irrigation start/stop status update"""
        await self.send(text_data=json.dumps({
            'type': 'irrigation_status',
            'status': event['status'],
        }))

    # ── Database helpers ────────────────────────────────────────

    @database_sync_to_async
    def check_farm_access(self):
        from apps.farms.models import Farm
        try:
            farm = Farm.objects.get(id=self.farm_id)
            return farm.owner == self.user or self.user.role in ['admin', 'advisor']
        except Farm.DoesNotExist:
            return False

    @database_sync_to_async
    def get_latest_snapshot(self):
        """Get the most recent reading from all devices in this farm"""
        from apps.iot.models import IoTDevice, SensorReading
        devices = IoTDevice.objects.filter(field__farm_id=self.farm_id, is_online=True)
        result = {}
        for device in devices:
            reading = SensorReading.objects.filter(device=device).first()
            if reading:
                result[str(device.id)] = {
                    'device_name':  device.device_name,
                    'device_type':  device.device_type,
                    'battery':      device.battery_level,
                    'soil_moisture':reading.soil_moisture_pct,
                    'soil_temp':    reading.soil_temp_celsius,
                    'air_temp':     reading.air_temp_celsius,
                    'humidity':     reading.humidity_pct,
                    'ph':           reading.soil_ph,
                    'ndvi':         reading.ndvi,
                    'rainfall':     reading.rainfall_mm,
                    'wind_speed':   reading.wind_speed_kmh,
                    'timestamp':    reading.timestamp.isoformat() if reading.timestamp else None,
                }
        return result

    @database_sync_to_async
    def send_irrigation_command(self, data):
        """Log irrigation command (in production → MQTT broker)"""
        from apps.iot.models import IoTDevice
        device_id = data.get('device_id')
        action    = data.get('action', 'start')  # start | stop
        duration_min = data.get('duration_minutes', 30)
        try:
            device = IoTDevice.objects.get(id=device_id, field__farm_id=self.farm_id)
            # In production: publish to MQTT topic device/{device_id}/commands
            return {'success': True, 'device': str(device.id), 'action': action, 'duration': duration_min}
        except IoTDevice.DoesNotExist:
            return {'success': False, 'error': 'Device not found'}

    @database_sync_to_async
    def get_historical_data(self, device_id, hours):
        from apps.iot.models import SensorReading, IoTDevice
        from django.utils import timezone
        from datetime import timedelta
        since = timezone.now() - timedelta(hours=hours)
        try:
            device = IoTDevice.objects.get(id=device_id, field__farm_id=self.farm_id)
            readings = SensorReading.objects.filter(
                device=device, timestamp__gte=since
            ).values(
                'timestamp', 'soil_moisture_pct', 'air_temp_celsius',
                'humidity_pct', 'soil_ph', 'ndvi', 'rainfall_mm'
            )[:500]
            return list(readings)
        except IoTDevice.DoesNotExist:
            return []


class DashboardConsumer(AsyncWebsocketConsumer):
    """
    Full-farm dashboard real-time updates
    ws://domain/ws/dashboard/<user_id>/
    """
    async def connect(self):
        self.user_id   = self.scope['url_route']['kwargs']['user_id']
        self.group_name= f'dashboard_{self.user_id}'
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def dashboard_update(self, event):
        await self.send(text_data=json.dumps(event['data']))

    async def receive(self, text_data):
        pass  # Dashboard is read-only push

# Alias for routing compatibility
SensorConsumer = SensorStreamConsumer
