"""HARVESTIA - ASGI: HTTP + WebSocket"""
import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'harvestia_backend.settings.development')

django_asgi = get_asgi_application()

from apps.iot.routing    import websocket_urlpatterns as iot_ws
from apps.alerts.routing import websocket_urlpatterns as alert_ws

application = ProtocolTypeRouter({
    'http': django_asgi,
    'websocket': AuthMiddlewareStack(
        URLRouter(iot_ws + alert_ws)
    ),
})
