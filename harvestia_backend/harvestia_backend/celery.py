"""HARVESTIA - Celery (optional background tasks)"""
import os
from celery import Celery

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'harvestia_backend.settings.development')
app = Celery('harvestia')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()
