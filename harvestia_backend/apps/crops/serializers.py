"""HARVESTIA - Crops Serializers"""
from rest_framework import serializers
from .models import CropSeason, GrowthLog, InputApplication


class GrowthLogSerializer(serializers.ModelSerializer):
    class Meta:
        model  = GrowthLog
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'ai_analysis', 'ai_health_score']


class InputApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model  = InputApplication
        fields = '__all__'
        read_only_fields = ['id', 'created_at']


class CropSeasonSerializer(serializers.ModelSerializer):
    total_cost   = serializers.ReadOnlyField()
    profit       = serializers.ReadOnlyField()
    growth_logs  = GrowthLogSerializer(many=True, read_only=True)
    inputs       = InputApplicationSerializer(many=True, read_only=True)
    field_name   = serializers.SerializerMethodField()
    farm_name    = serializers.SerializerMethodField()

    class Meta:
        model  = CropSeason
        fields = [
            'id', 'field', 'field_name', 'farm_name', 'farmer',
            'crop_type', 'variety', 'season', 'year',
            'sowing_date', 'expected_harvest_date', 'actual_harvest_date',
            'current_stage', 'is_active', 'notes',
            'seed_cost_per_acre', 'fertilizer_cost', 'pesticide_cost',
            'irrigation_cost', 'labour_cost', 'other_cost',
            'actual_yield_tons', 'selling_price_per_ton', 'total_revenue',
            'total_cost', 'profit',
            'growth_logs', 'inputs',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'farmer', 'created_at', 'updated_at']

    def get_field_name(self, obj):
        return obj.field.name

    def get_farm_name(self, obj):
        return obj.field.farm.name


class CropSeasonListSerializer(CropSeasonSerializer):
    """Lightweight for list views"""
    class Meta(CropSeasonSerializer.Meta):
        fields = [
            'id', 'field', 'field_name', 'farm_name',
            'crop_type', 'season', 'year', 'current_stage',
            'sowing_date', 'expected_harvest_date', 'is_active',
            'actual_yield_tons', 'profit',
        ]
