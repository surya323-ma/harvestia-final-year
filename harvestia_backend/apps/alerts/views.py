"""HARVESTIA - Alerts Views"""
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter

from .models import Alert
from .serializers import AlertSerializer


class AlertViewSet(viewsets.ReadOnlyModelViewSet):
    """
    GET  /api/v1/alerts/              - list all alerts (paginated)
    GET  /api/v1/alerts/{id}/         - single alert
    POST /api/v1/alerts/{id}/read/    - mark as read
    POST /api/v1/alerts/{id}/resolve/ - mark as resolved
    GET  /api/v1/alerts/summary/      - counts by severity/type
    """
    serializer_class   = AlertSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends    = [DjangoFilterBackend, OrderingFilter]
    filterset_fields   = ['alert_type', 'severity', 'is_read', 'is_resolved']
    ordering_fields    = ['created_at', 'severity']
    ordering           = ['-created_at']

    def get_queryset(self):
        return Alert.objects.filter(user=self.request.user).select_related('farm', 'field')

    @action(detail=True, methods=['post'])
    def read(self, request, pk=None):
        """POST /api/v1/alerts/{id}/read/"""
        alert = self.get_object()
        alert.is_read = True
        alert.save(update_fields=['is_read'])
        return Response({'status': 'marked as read'})

    @action(detail=True, methods=['post'])
    def resolve(self, request, pk=None):
        """POST /api/v1/alerts/{id}/resolve/"""
        alert = self.get_object()
        alert.is_resolved  = True
        alert.resolved_at  = timezone.now()
        alert.resolved_by  = request.user
        alert.resolution_note = request.data.get('note', '')
        alert.save(update_fields=['is_resolved', 'resolved_at', 'resolved_by', 'resolution_note'])
        return Response({'status': 'resolved'})

    @action(detail=False, methods=['post'])
    def read_all(self, request):
        """POST /api/v1/alerts/read-all/ — mark all as read"""
        count = Alert.objects.filter(user=request.user, is_read=False).update(is_read=True)
        return Response({'marked_read': count})

    @action(detail=False, methods=['get'])
    def summary(self, request):
        """GET /api/v1/alerts/summary/ — counts for dashboard badge"""
        qs = Alert.objects.filter(user=request.user, is_resolved=False)
        return Response({
            'total_unread': qs.filter(is_read=False).count(),
            'critical':     qs.filter(severity='critical').count(),
            'high':         qs.filter(severity='high').count(),
            'medium':       qs.filter(severity='medium').count(),
            'low':          qs.filter(severity='low').count(),
            'by_type': {
                t: qs.filter(alert_type=t).count()
                for t in ['disease', 'pest', 'irrigation', 'weather', 'soil']
            }
        })
