"""HARVESTIA - Crops URL patterns"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CropSeasonViewSet

router = DefaultRouter()
router.register(r'seasons', CropSeasonViewSet, basename='cropseason')

urlpatterns = [path('', include(router.urls))]
