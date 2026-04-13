"""HARVESTIA - Farms URL patterns"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FarmViewSet, FieldViewSet

router = DefaultRouter()
router.register(r'',      FarmViewSet,  basename='farm')
router.register(r'fields', FieldViewSet, basename='field')

urlpatterns = [
    path('', include(router.urls)),
]
