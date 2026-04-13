"""
HARVESTIA - IoT Sensor Models + WebSocket Consumer
Real-time sensor data streaming via Django Channels
"""
from django.db import models
import uuid


# ─── MODELS ────────────────────────────────────────────────────

class IoTDevice(models.Model):
    """Physical IoT sensor node registered in the system"""
    id          = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    field       = models.ForeignKey('farms.Field', on_delete=models.CASCADE, related_name='iot_devices')
    device_id   = models.CharField(max_length=100, unique=True)
    device_name = models.CharField(max_length=200)

    DEVICE_TYPES = [
        ('soil_sensor',    'Soil Sensor (moisture/temp/pH)'),
        ('weather_station','Weather Station'),
        ('water_meter',    'Water Flow Meter'),
        ('camera',         'Field Camera'),
        ('drone',          'Drone Node'),
        ('leaf_sensor',    'Leaf Wetness Sensor'),
        ('ndvi_sensor',    'NDVI Sensor'),
    ]
    device_type    = models.CharField(max_length=30, choices=DEVICE_TYPES)
    firmware_version= models.CharField(max_length=20, blank=True)
    battery_level  = models.IntegerField(default=100, help_text='percentage')
    signal_strength= models.IntegerField(null=True, help_text='RSSI dBm')
    location_lat   = models.FloatField(null=True)
    location_lng   = models.FloatField(null=True)
    is_online      = models.BooleanField(default=False)
    last_ping      = models.DateTimeField(null=True)
    installed_at   = models.DateTimeField(null=True)
    created_at     = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'iot_devices'

    def __str__(self):
        return f"{self.device_name} ({self.device_type}) — {self.field.name}"


class SensorReading(models.Model):
    """Individual sensor measurement (high frequency data)"""
    id        = models.BigAutoField(primary_key=True)
    device    = models.ForeignKey(IoTDevice, on_delete=models.CASCADE, related_name='readings')
    timestamp = models.DateTimeField(db_index=True)

    # Soil metrics
    soil_moisture_pct    = models.FloatField(null=True)
    soil_temp_celsius    = models.FloatField(null=True)
    soil_ph              = models.FloatField(null=True)
    soil_ec              = models.FloatField(null=True, help_text='dS/m')
    soil_nitrogen        = models.FloatField(null=True, help_text='ppm')
    soil_phosphorus      = models.FloatField(null=True, help_text='ppm')
    soil_potassium       = models.FloatField(null=True, help_text='ppm')

    # Atmospheric metrics
    air_temp_celsius     = models.FloatField(null=True)
    humidity_pct         = models.FloatField(null=True)
    rainfall_mm          = models.FloatField(null=True)
    wind_speed_kmh       = models.FloatField(null=True)
    wind_direction_deg   = models.FloatField(null=True)
    solar_radiation      = models.FloatField(null=True, help_text='W/m2')
    uv_index             = models.FloatField(null=True)
    pressure_hpa         = models.FloatField(null=True)
    dew_point_celsius    = models.FloatField(null=True)

    # Crop metrics
    leaf_wetness         = models.FloatField(null=True, help_text='0-1')
    ndvi                 = models.FloatField(null=True, help_text='0-1 vegetation index')
    canopy_temp_celsius  = models.FloatField(null=True)

    # Water metrics
    water_flow_lph       = models.FloatField(null=True)
    water_consumed_liters= models.FloatField(null=True)

    # AI anomaly flag
    is_anomaly           = models.BooleanField(default=False)
    anomaly_score        = models.FloatField(null=True)

    class Meta:
        db_table = 'sensor_readings'
        ordering = ['-timestamp']
        indexes  = [
            models.Index(fields=['device', 'timestamp']),
            models.Index(fields=['timestamp']),
        ]
        # Partition by month for performance (via TimescaleDB in production)


class SatelliteImagery(models.Model):
    """Satellite scan results per field (from Sentinel-2)"""
    id          = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    field       = models.ForeignKey('farms.Field', on_delete=models.CASCADE, related_name='satellite_scans')
    scan_date   = models.DateField()
    source      = models.CharField(max_length=50, default='Sentinel-2')

    # Vegetation Indices
    ndvi        = models.FloatField(null=True, help_text='Normalized Difference Vegetation Index')
    ndwi        = models.FloatField(null=True, help_text='Normalized Difference Water Index')
    evi         = models.FloatField(null=True, help_text='Enhanced Vegetation Index')
    savi        = models.FloatField(null=True, help_text='Soil Adjusted Vegetation Index')
    lai         = models.FloatField(null=True, help_text='Leaf Area Index')

    # Health Scores from CNN analysis
    crop_health_score = models.FloatField(null=True, help_text='0-100')
    stress_zones_pct  = models.FloatField(null=True, help_text='% of field showing stress')
    cloud_cover_pct   = models.FloatField(null=True)

    # File paths
    rgb_image_url    = models.URLField(blank=True)
    ndvi_image_url   = models.URLField(blank=True)
    raw_data_url     = models.URLField(blank=True)

    ai_analysis      = models.JSONField(default=dict)
    created_at       = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'satellite_imagery'
        ordering = ['-scan_date']
        unique_together = ['field', 'scan_date']
