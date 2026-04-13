"""HARVESTIA - Alerts WebSocket URL routing"""
from django.urls import path
from apps.iot.consumers import DashboardConsumer

websocket_urlpatterns = [
    path('ws/dashboard/<str:user_id>/', DashboardConsumer.as_asgi()),
]
