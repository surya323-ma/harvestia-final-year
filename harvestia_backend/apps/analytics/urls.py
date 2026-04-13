"""HARVESTIA - Analytics URL patterns"""
from django.urls import path
from .views import DashboardView, YieldHistoryView

urlpatterns = [
    path('dashboard/',     DashboardView.as_view(),    name='analytics-dashboard'),
    path('yield-history/', YieldHistoryView.as_view(), name='analytics-yield-history'),
]
