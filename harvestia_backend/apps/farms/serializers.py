"""HARVESTIA - Farms Serializers"""
from rest_framework import serializers
from .models import Farm, Field, SoilReport


class SoilReportSerializer(serializers.ModelSerializer):
    class Meta:
        model  = SoilReport
        fields = '__all__'
        read_only_fields = ['id', 'created_at']


class FieldSerializer(serializers.ModelSerializer):
    current_crop_name = serializers.SerializerMethodField()
    soil_reports      = SoilReportSerializer(many=True, read_only=True)

    class Meta:
        model  = Field
        fields = [
            'id', 'farm', 'name', 'area_acres', 'soil_type', 'soil_ph',
            'organic_matter', 'irrigation_type', 'water_source',
            'irrigation_capacity_lph', 'is_fallow', 'last_crop',
            'current_crop_name', 'soil_reports', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_current_crop_name(self, obj):
        season = obj.current_crop
        return season.crop_type if season else None


class FarmSerializer(serializers.ModelSerializer):
    fields      = FieldSerializer(many=True, read_only=True)
    field_count = serializers.ReadOnlyField()
    owner_name  = serializers.SerializerMethodField()

    class Meta:
        model  = Farm
        fields = [
            'id', 'name', 'description', 'total_area',
            'location_lat', 'location_lng', 'village', 'district', 'state', 'pincode',
            'is_active', 'field_count', 'owner_name', 'fields',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_owner_name(self, obj):
        return obj.owner.full_name


class FarmListSerializer(FarmSerializer):
    """Lightweight version for list view — no nested fields"""
    class Meta(FarmSerializer.Meta):
        fields = [
            'id', 'name', 'total_area', 'district', 'state',
            'field_count', 'is_active', 'created_at',
        ]
