"""
HARVESTIA - ML URL Routes
"""
from django.urls import path
from . import ml_views

urlpatterns = [
    # Individual model endpoints
    path('yield/predict/',        ml_views.YieldPredictView.as_view(),    name='yield-predict'),
    path('disease/detect/',       ml_views.DiseaseDetectView.as_view(),   name='disease-detect'),
    path('irrigation/optimize/',  ml_views.IrrigationOptimizeView.as_view(), name='irrigation-optimize'),
    path('pest/risk/',            ml_views.PestRiskView.as_view(),        name='pest-risk'),
    path('soil/analyze/',         ml_views.SoilHealthView.as_view(),      name='soil-analyze'),
    path('price/forecast/',       ml_views.PriceForecastView.as_view(),   name='price-forecast'),
    path('sensor/anomaly/',       ml_views.SensorAnomalyView.as_view(),   name='sensor-anomaly'),

    # Combined intelligence
    path('field/intelligence/',   ml_views.FieldIntelligenceView.as_view(), name='field-intelligence'),

    # Status
    path('models/status/',        ml_views.ModelStatusView.as_view(),     name='model-status'),
]
