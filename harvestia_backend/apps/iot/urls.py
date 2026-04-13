"""HARVESTIA - IoT URL patterns"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import IoTDeviceViewSet, SensorReadingViewSet, SatelliteViewSet

router = DefaultRouter()
router.register(r'devices',   IoTDeviceViewSet,    basename='device')
router.register(r'readings',  SensorReadingViewSet, basename='reading')
router.register(r'satellite', SatelliteViewSet,     basename='satellite')

urlpatterns = [path('', include(router.urls))]
