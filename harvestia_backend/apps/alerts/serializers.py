"""HARVESTIA - Alerts Serializers"""
from rest_framework import serializers
from .models import Alert


class AlertSerializer(serializers.ModelSerializer):
    farm_name  = serializers.SerializerMethodField()
    field_name = serializers.SerializerMethodField()

    class Meta:
        model  = Alert
        fields = [
            'id', 'farm', 'farm_name', 'field', 'field_name',
            'alert_type', 'severity', 'title', 'message', 'action_required',
            'ml_model', 'ml_confidence', 'estimated_loss_inr', 'estimated_saving_inr',
            'is_read', 'is_resolved', 'resolved_at', 'resolution_note',
            'push_sent', 'sms_sent', 'email_sent',
            'expires_at', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'resolved_at']

    def get_farm_name(self, obj):
        return obj.farm.name if obj.farm else None

    def get_field_name(self, obj):
        return obj.field.name if obj.field else None
