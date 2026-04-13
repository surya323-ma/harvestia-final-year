"""HARVESTIA - IoT Views (Devices, Readings, Satellite)"""
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter

from .models import IoTDevice, SensorReading, SatelliteImagery


class IoTDeviceSerializer:
    pass  # Inline below


from rest_framework import serializers

class IoTDeviceSerializer(serializers.ModelSerializer):
    field_name = serializers.SerializerMethodField()
    class Meta:
        model  = IoTDevice
        fields = '__all__'
        read_only_fields = ['id', 'created_at']
    def get_field_name(self, obj):
        return obj.field.name


class SensorReadingSerializer(serializers.ModelSerializer):
    class Meta:
        model  = SensorReading
        fields = '__all__'


class SatelliteImagerySerializer(serializers.ModelSerializer):
    field_name = serializers.SerializerMethodField()
    class Meta:
        model  = SatelliteImagery
        fields = '__all__'
        read_only_fields = ['id', 'created_at']
    def get_field_name(self, obj):
        return obj.field.name


class IoTDeviceViewSet(viewsets.ModelViewSet):
    """
    GET  /api/v1/iot/devices/       - list devices for user's farms
    GET  /api/v1/iot/devices/{id}/  - device detail
    """
    serializer_class   = IoTDeviceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return IoTDevice.objects.filter(field__farm__owner=self.request.user)

    @action(detail=True, methods=['get'])
    def latest_reading(self, request, pk=None):
        device  = self.get_object()
        reading = SensorReading.objects.filter(device=device).first()
        if reading:
            return Response(SensorReadingSerializer(reading).data)
        return Response({'detail': 'No readings yet.'}, status=status.HTTP_404_NOT_FOUND)


class SensorReadingViewSet(viewsets.ReadOnlyModelViewSet):
    """
    GET /api/v1/iot/readings/  - paginated sensor readings
    """
    serializer_class   = SensorReadingSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends    = [DjangoFilterBackend, OrderingFilter]
    filterset_fields   = ['device', 'is_anomaly']
    ordering           = ['-timestamp']

    def get_queryset(self):
        return SensorReading.objects.filter(device__field__farm__owner=self.request.user)


class SatelliteViewSet(viewsets.ReadOnlyModelViewSet):
    """GET /api/v1/iot/satellite/"""
    serializer_class   = SatelliteImagerySerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends    = [DjangoFilterBackend, OrderingFilter]
    filterset_fields   = ['field']
    ordering           = ['-scan_date']

    def get_queryset(self):
        return SatelliteImagery.objects.filter(field__farm__owner=self.request.user)
