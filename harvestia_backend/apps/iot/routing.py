"""HARVESTIA - IoT WebSocket URL routing"""
from django.urls import path
from .consumers import SensorConsumer

websocket_urlpatterns = [
    path('ws/sensors/<str:farm_id>/', SensorConsumer.as_asgi()),
]
