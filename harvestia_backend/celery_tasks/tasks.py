"""
╔═════════════════════════════════════════════════════════════╗
║  HARVESTIA - Celery Background Tasks                        ║
║  Runs scheduled ML inference, data sync, report generation ║
╚═════════════════════════════════════════════════════════════╝
"""
import logging
from celery import shared_task
from celery.utils.log import get_task_logger

logger = get_task_logger(__name__)


# ══════════════════════════════════════════════════════════════
# SATELLITE TASKS
# ══════════════════════════════════════════════════════════════

@shared_task(bind=True, max_retries=3, default_retry_delay=300, name='celery_tasks.satellite.run_ndvi_scan')
def run_ndvi_scan(self, farm_ids=None):
    """
    Daily satellite NDVI scan for all active farms.
    Fetches Sentinel-2 imagery → runs CNN analysis → updates SatelliteImagery table.
    Scheduled: Daily at 2:00 AM IST
    """
    from apps.farms.models import Farm, Field
    from apps.iot.models import SatelliteImagery
    from django.utils import timezone
    import random

    try:
        farms = Farm.objects.filter(is_active=True)
        if farm_ids:
            farms = farms.filter(id__in=farm_ids)

        processed = 0
        for farm in farms:
            for field in farm.fields.all():
                # In production: call Sentinel Hub API with field polygon
                # sentinel_data = fetch_sentinel2(field.boundary, date=today)
                # ndvi_score = compute_ndvi(sentinel_data)
                # cnn_result = DiseaseDetector.analyze_image(sentinel_data.rgb)

                # Simulated values
                ndvi     = round(random.uniform(0.45, 0.90), 3)
                health   = round(ndvi * 95 + random.uniform(-5, 5), 1)
                stress   = round(max(0, (0.65 - ndvi) * 100), 1)

                SatelliteImagery.objects.update_or_create(
                    field=field,
                    scan_date=timezone.now().date(),
                    defaults={
                        'ndvi':             ndvi,
                        'ndwi':             round(random.uniform(-0.1, 0.3), 3),
                        'evi':              round(ndvi * 0.85, 3),
                        'crop_health_score':health,
                        'stress_zones_pct': stress,
                        'cloud_cover_pct':  round(random.uniform(0, 15), 1),
                        'ai_analysis': {
                            'vegetation_density': 'High' if ndvi > 0.7 else 'Medium' if ndvi > 0.5 else 'Low',
                            'water_stress': stress > 20,
                            'anomaly_zones': [],
                        }
                    }
                )
                processed += 1

        logger.info(f"NDVI scan complete: {processed} fields updated")
        return {'status': 'success', 'fields_scanned': processed}

    except Exception as exc:
        logger.error(f"NDVI scan failed: {exc}")
        raise self.retry(exc=exc)


# ══════════════════════════════════════════════════════════════
# WEATHER TASKS
# ══════════════════════════════════════════════════════════════

@shared_task(bind=True, max_retries=5, name='celery_tasks.weather.sync_weather_data')
def sync_weather_data(self):
    """
    Hourly: Fetch weather for all active farm locations from OpenWeatherMap API.
    Also runs AI weather-based alert checks.
    """
    import requests, os
    from apps.farms.models import Farm
    from django.core.cache import cache

    API_KEY = os.environ.get('OPENWEATHER_API_KEY')
    if not API_KEY:
        logger.warning("OpenWeather API key not set")
        return {'status': 'skipped', 'reason': 'no_api_key'}

    farms = Farm.objects.filter(is_active=True).values('id', 'location_lat', 'location_lng', 'name')
    updated = 0

    for farm in farms:
        try:
            url = (f"https://api.openweathermap.org/data/2.5/forecast"
                   f"?lat={farm['location_lat']}&lon={farm['location_lng']}"
                   f"&appid={API_KEY}&units=metric&cnt=56")
            resp    = requests.get(url, timeout=10)
            weather = resp.json()

            cache_key = f"weather:farm:{farm['id']}"
            cache.set(cache_key, weather, timeout=3700)

            # Check for severe weather
            check_weather_alerts.delay(str(farm['id']), weather)
            updated += 1

        except Exception as e:
            logger.warning(f"Weather sync failed for farm {farm['id']}: {e}")

    return {'status': 'success', 'farms_updated': updated}


@shared_task(name='celery_tasks.weather.check_weather_alerts')
def check_weather_alerts(farm_id: str, weather_data: dict):
    """Check weather forecast for alert conditions and create alerts if needed"""
    from apps.farms.models import Farm
    from apps.alerts.models import Alert
    from django.contrib.auth import get_user_model

    try:
        farm = Farm.objects.get(id=farm_id)
        forecasts = weather_data.get('list', [])

        for fc in forecasts[:16]:  # Next 48 hours (3hr intervals)
            temp      = fc.get('main', {}).get('temp', 25)
            wind_kmh  = fc.get('wind', {}).get('speed', 0) * 3.6
            rain_3h   = fc.get('rain', {}).get('3h', 0)
            desc      = fc.get('weather', [{}])[0].get('main', '')

            if wind_kmh > 60:
                Alert.objects.get_or_create(
                    farm=farm, user=farm.owner,
                    alert_type='weather', severity='critical',
                    title=f'Strong Wind Alert — {farm.name}',
                    defaults={
                        'message': f'Wind speed {round(wind_kmh)} km/h forecast. Secure drip lines, delay spraying.',
                        'ml_model': 'weather_engine',
                    }
                )
            if rain_3h > 40:
                Alert.objects.get_or_create(
                    farm=farm, user=farm.owner,
                    alert_type='weather', severity='high',
                    title=f'Heavy Rain Alert — {farm.name}',
                    defaults={
                        'message': f'Heavy rainfall {round(rain_3h)}mm expected. Pause irrigation. Check drainage.',
                        'ml_model': 'weather_engine',
                    }
                )
    except Exception as e:
        logger.error(f"Weather alert check failed: {e}")


# ══════════════════════════════════════════════════════════════
# ML INFERENCE TASKS
# ══════════════════════════════════════════════════════════════

@shared_task(bind=True, name='celery_tasks.ml_inference.batch_yield_predictions')
def batch_yield_predictions(self):
    """
    Weekly: Run yield predictions for all active crop seasons.
    Updates YieldPrediction table and triggers alerts for high-risk fields.
    Scheduled: Every Monday at 3:00 AM
    """
    from apps.crops.models import CropSeason
    from ml_engine.ml_models import MLRegistry
    from apps.analytics.models import YieldPrediction
    import random

    model     = MLRegistry.get_yield_predictor()
    seasons   = CropSeason.objects.filter(is_active=True).select_related('field__farm', 'farmer')
    predictions_made = 0

    for season in seasons:
        try:
            field = season.field
            # In production: get real NDVI from SatelliteImagery, sensors from DB
            inputs = {
                'ndvi':          random.uniform(0.45, 0.90),
                'soil_moisture': random.uniform(35, 70),
                'temperature':   random.uniform(22, 34),
                'rainfall_30d':  random.uniform(10, 80),
                'crop_age':      (season.actual_harvest_date - season.sowing_date).days if season.actual_harvest_date else 90,
                'field_area':    float(field.area_acres),
                'soil_ph':       field.soil_ph or 6.7,
                'nitrogen_kgha': 120,
                'crop_type':     season.crop_type,
            }
            result = model.predict(inputs)

            # Save prediction
            YieldPrediction.objects.update_or_create(
                crop_season=season,
                defaults={
                    'predicted_yield': result['predicted_yield'],
                    'confidence_pct':  result['confidence_pct'],
                    'risk_level':      result['risk_level'],
                    'recommendations': result['recommendations'],
                    'model_version':   result['model_version'],
                }
            )

            # Create alert if risk is high
            if result['risk_level'] in ['Critical', 'High']:
                from apps.alerts.models import Alert
                Alert.objects.get_or_create(
                    farm=field.farm, field=field,
                    user=season.farmer, alert_type='yield',
                    severity='critical' if result['risk_level'] == 'Critical' else 'high',
                    title=f'{result["risk_level"]} Yield Risk — {season.crop_type.title()} in {field.name}',
                    defaults={
                        'message':        f"AI predicts {result['predicted_yield']} tons/acre. Confidence: {result['confidence_pct']}%",
                        'action_required':result['recommendations'][0]['action'] if result['recommendations'] else '',
                        'ml_model':       'yield_predictor',
                        'ml_confidence':  result['confidence_pct'] / 100,
                        'ml_payload':     result,
                    }
                )

            predictions_made += 1

        except Exception as e:
            logger.error(f"Yield prediction failed for season {season.id}: {e}")

    return {'status': 'success', 'predictions_made': predictions_made}


@shared_task(name='celery_tasks.alerts.run_alert_engine')
def run_alert_engine():
    """
    Every 5 minutes: Check sensor data against ML models → generate alerts
    The core real-time intelligence loop of Harvestia.
    """
    from apps.iot.models import IoTDevice, SensorReading
    from ml_engine.ml_models import MLRegistry
    from apps.alerts.models import Alert
    from channels.layers import get_channel_layer
    from asgiref.sync import async_to_sync
    from django.utils import timezone
    from datetime import timedelta

    anomaly_model = MLRegistry.get_anomaly_detector()
    pest_model    = MLRegistry.get_pest_model()
    channel_layer = get_channel_layer()

    cutoff  = timezone.now() - timedelta(minutes=15)
    devices = IoTDevice.objects.filter(is_online=True).select_related('field__farm__owner')
    alerts_created = 0

    for device in devices:
        reading = SensorReading.objects.filter(
            device=device, timestamp__gte=cutoff
        ).order_by('-timestamp').first()

        if not reading:
            continue

        # 1. Check for sensor anomalies
        anomaly_result = anomaly_model.detect({
            'air_temp':     reading.air_temp_celsius,
            'humidity':     reading.humidity_pct,
            'soil_moisture':reading.soil_moisture_pct,
            'soil_ph':      reading.soil_ph,
            'wind_speed':   reading.wind_speed_kmh,
            'ndvi':         reading.ndvi,
        })
        if anomaly_result['is_anomaly'] and anomaly_result['severity'] == 'High':
            alert = Alert.objects.create(
                farm=device.field.farm, field=device.field,
                user=device.field.farm.owner,
                alert_type='sensor', severity='high',
                title=f'Sensor Anomaly — {device.device_name}',
                message=f"Unusual readings detected: {', '.join(anomaly_result['reasons'])}",
                action_required=anomaly_result['action'],
                ml_model='sensor_anomaly_detector',
                ml_confidence=abs(anomaly_result['anomaly_score']),
                ml_payload=anomaly_result,
            )
            alerts_created += 1

            # Push to WebSocket
            farm_group = f"farm_{device.field.farm.id}_sensors"
            async_to_sync(channel_layer.group_send)(farm_group, {
                'type':  'alert_triggered',
                'alert': {
                    'id':       str(alert.id),
                    'type':     alert.alert_type,
                    'severity': alert.severity,
                    'title':    alert.title,
                    'message':  alert.message,
                }
            })

        # 2. Check pest risk
        pest_result = pest_model.predict({
            'temperature': reading.air_temp_celsius,
            'humidity':    reading.humidity_pct,
            'rainfall_7d': reading.rainfall_mm,
            'crop_age':    60,
        })
        if pest_result.get('overall_alert'):
            Alert.objects.get_or_create(
                farm=device.field.farm, field=device.field,
                user=device.field.farm.owner,
                alert_type='pest',
                title=f"Pest Risk: {pest_result['top_risk_pest']}",
                defaults={
                    'severity': 'high',
                    'message':  f"{pest_result['top_risk_pest']} risk at {pest_result['top_risk_score']}%",
                    'ml_model': 'pest_risk_model',
                    'ml_payload': pest_result,
                }
            )
            alerts_created += 1

    return {'status': 'success', 'alerts_created': alerts_created}


@shared_task(name='celery_tasks.iot.detect_sensor_anomalies')
def detect_sensor_anomalies():
    """Every 15 min: Run anomaly detection on all recent sensor readings"""
    # Delegated to run_alert_engine above
    return run_alert_engine()


@shared_task(name='celery_tasks.reports.generate_farm_reports')
def generate_farm_reports():
    """
    Weekly Sunday 6AM: Generate PDF farm performance reports for all premium users.
    """
    from apps.accounts.models import CustomUser
    from django.core.mail import EmailMessage

    premium_users = CustomUser.objects.filter(plan__in=['pro', 'enterprise'], is_active=True)
    reports_sent  = 0

    for user in premium_users:
        try:
            # In production: generate PDF with ReportLab/WeasyPrint
            # pdf = generate_farm_report_pdf(user)
            # EmailMessage(
            #     subject=f'Weekly Farm Report — {datetime.now().strftime("%B %d")}',
            #     body='Your weekly AI-powered farm intelligence report is attached.',
            #     to=[user.email], attachments=[('report.pdf', pdf, 'application/pdf')]
            # ).send()
            reports_sent += 1
        except Exception as e:
            logger.error(f"Report gen failed for {user.email}: {e}")

    return {'status': 'success', 'reports_sent': reports_sent}
