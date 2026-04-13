"""HARVESTIA - Farms Views"""
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from .models import Farm, Field, SoilReport
from .serializers import FarmSerializer, FarmListSerializer, FieldSerializer, SoilReportSerializer


class FarmViewSet(viewsets.ModelViewSet):
    """
    CRUD for farms owned by the authenticated user.
    GET  /api/v1/farms/          - list user's farms
    POST /api/v1/farms/          - create farm
    GET  /api/v1/farms/{id}/     - farm detail with fields
    GET  /api/v1/farms/{id}/fields/  - list fields for farm
    """
    permission_classes = [permissions.IsAuthenticated]
    filter_backends    = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields      = ['name', 'district', 'state']
    ordering_fields    = ['name', 'total_area', 'created_at']
    ordering           = ['-created_at']

    def get_queryset(self):
        return Farm.objects.filter(owner=self.request.user, is_active=True).prefetch_related('fields')

    def get_serializer_class(self):
        if self.action == 'list':
            return FarmListSerializer
        return FarmSerializer

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    @action(detail=True, methods=['get', 'post'])
    def fields(self, request, pk=None):
        """GET/POST /api/v1/farms/{id}/fields/"""
        farm = self.get_object()
        if request.method == 'GET':
            fields = Field.objects.filter(farm=farm)
            return Response(FieldSerializer(fields, many=True).data)
        serializer = FieldSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(farm=farm)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['get'])
    def summary(self, request, pk=None):
        """GET /api/v1/farms/{id}/summary/ — dashboard stats"""
        farm = self.get_object()
        total_fields   = farm.fields.count()
        active_seasons = sum(1 for f in farm.fields.all() if f.current_crop)
        total_area     = float(farm.total_area)
        return Response({
            'farm_id':       str(farm.id),
            'farm_name':     farm.name,
            'total_area':    total_area,
            'total_fields':  total_fields,
            'active_crops':  active_seasons,
            'fallow_fields': farm.fields.filter(is_fallow=True).count(),
            'district':      farm.district,
            'state':         farm.state,
        })


class FieldViewSet(viewsets.ModelViewSet):
    """CRUD for fields. Nested under farms."""
    serializer_class   = FieldSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Field.objects.filter(farm__owner=self.request.user)

    @action(detail=True, methods=['get'])
    def soil_reports(self, request, pk=None):
        field = self.get_object()
        reports = SoilReport.objects.filter(field=field)
        return Response(SoilReportSerializer(reports, many=True).data)
