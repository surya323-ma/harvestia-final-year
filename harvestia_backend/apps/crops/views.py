"""HARVESTIA - Crops Views"""
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from .models import CropSeason, GrowthLog, InputApplication
from .serializers import (
    CropSeasonSerializer, CropSeasonListSerializer,
    GrowthLogSerializer, InputApplicationSerializer,
)


class CropSeasonViewSet(viewsets.ModelViewSet):
    """
    GET    /api/v1/crops/seasons/              - list all crop seasons
    POST   /api/v1/crops/seasons/              - create season
    GET    /api/v1/crops/seasons/{id}/         - detail
    PATCH  /api/v1/crops/seasons/{id}/         - update stage/data
    GET    /api/v1/crops/seasons/{id}/logs/    - growth logs
    POST   /api/v1/crops/seasons/{id}/logs/    - add log
    GET    /api/v1/crops/seasons/{id}/inputs/  - input applications
    POST   /api/v1/crops/seasons/{id}/inputs/  - add input
    """
    permission_classes = [permissions.IsAuthenticated]
    filter_backends    = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields   = ['crop_type', 'season', 'year', 'current_stage', 'is_active']
    search_fields      = ['crop_type', 'variety']
    ordering_fields    = ['sowing_date', 'created_at']
    ordering           = ['-sowing_date']

    def get_queryset(self):
        return CropSeason.objects.filter(
            farmer=self.request.user
        ).select_related('field', 'field__farm')

    def get_serializer_class(self):
        if self.action == 'list':
            return CropSeasonListSerializer
        return CropSeasonSerializer

    def perform_create(self, serializer):
        serializer.save(farmer=self.request.user)

    @action(detail=True, methods=['get', 'post'])
    def logs(self, request, pk=None):
        """Growth logs for a crop season"""
        season = self.get_object()
        if request.method == 'GET':
            logs = GrowthLog.objects.filter(crop_season=season)
            return Response(GrowthLogSerializer(logs, many=True).data)
        serializer = GrowthLogSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(crop_season=season)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['get', 'post'])
    def inputs(self, request, pk=None):
        """Input applications for a crop season"""
        season = self.get_object()
        if request.method == 'GET':
            inputs = InputApplication.objects.filter(crop_season=season)
            return Response(InputApplicationSerializer(inputs, many=True).data)
        serializer = InputApplicationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(crop_season=season)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['get'])
    def active(self, request):
        """GET /api/v1/crops/seasons/active/ — currently growing crops"""
        active = self.get_queryset().filter(is_active=True)
        return Response(CropSeasonListSerializer(active, many=True).data)
