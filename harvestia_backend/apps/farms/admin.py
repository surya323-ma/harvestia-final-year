from django.contrib import admin
from .models import Farm, Field, SoilReport

@admin.register(Farm)
class FarmAdmin(admin.ModelAdmin):
    list_display  = ['name', 'owner', 'total_area', 'district', 'state', 'is_active', 'created_at']
    list_filter   = ['state', 'is_active']
    search_fields = ['name', 'district', 'owner__email']

@admin.register(Field)
class FieldAdmin(admin.ModelAdmin):
    list_display  = ['name', 'farm', 'area_acres', 'soil_type', 'irrigation_type', 'is_fallow']
    list_filter   = ['soil_type', 'irrigation_type', 'is_fallow']

@admin.register(SoilReport)
class SoilReportAdmin(admin.ModelAdmin):
    list_display = ['field', 'test_date', 'ph', 'ai_health_score']
