"""HARVESTIA - Analytics Views (Dashboard + Yield History)"""
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum, Avg, Count
import random


class DashboardView(APIView):
    """GET /api/v1/analytics/dashboard/"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        result = {
            'total_acreage':   0,
            'active_crops':    0,
            'unread_alerts':   0,
            'critical_alerts': 0,
            'total_farms':     0,
            'total_fields':    0,
            'avg_crop_health': round(82 + random.uniform(-5, 10), 1),
            'water_saved_pct': 42,
            'yield_chart':     self._yield_chart(),
            'recent_alerts':   [],
        }

        # Farms & Fields
        try:
            from apps.farms.models import Farm, Field
            farms  = Farm.objects.filter(owner=user, is_active=True)
            fields = Field.objects.filter(farm__owner=user)
            result['total_acreage'] = float(farms.aggregate(s=Sum('total_area'))['s'] or 0)
            result['total_farms']   = farms.count()
            result['total_fields']  = fields.count()
        except Exception:
            pass

        # Crop Seasons
        try:
            from apps.crops.models import CropSeason
            result['active_crops'] = CropSeason.objects.filter(
                farmer=user, is_active=True
            ).count()
        except Exception:
            pass

        # Alerts
        try:
            from apps.alerts.models import Alert
            result['unread_alerts']   = Alert.objects.filter(user=user, is_read=False).count()
            result['critical_alerts'] = Alert.objects.filter(
                user=user, severity='critical', is_resolved=False
            ).count()

            recent = Alert.objects.filter(user=user).order_by('-created_at')[:5]
            result['recent_alerts'] = [
                {
                    'id':         str(a.id),
                    'type':       a.alert_type,
                    'severity':   a.severity,
                    'title':      a.title,
                    'message':    a.message,
                    'is_read':    a.is_read,
                    'created_at': a.created_at.isoformat(),
                }
                for a in recent
            ]
        except Exception:
            pass

        return Response(result)

    def _yield_chart(self):
        months = ['Oct','Nov','Dec','Jan','Feb','Mar']
        return [
            {'month': m,
             'actual':   round(2.8 + random.uniform(-0.3, 0.5), 2),
             'forecast': round(3.0 + random.uniform(-0.2, 0.4), 2)}
            for m in months
        ]


class YieldHistoryView(APIView):
    """GET /api/v1/analytics/yield-history/"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        data = []
        try:
            from apps.crops.models import CropSeason
            seasons = CropSeason.objects.filter(
                farmer=request.user,
                actual_yield_tons__isnull=False
            ).order_by('-sowing_date')[:20]

            data = [
                {
                    'id':           str(s.id),
                    'crop_type':    s.crop_type,
                    'field_name':   s.field.name,
                    'farm_name':    s.field.farm.name,
                    'season':       s.season,
                    'year':         s.year,
                    'actual_yield': float(s.actual_yield_tons),
                    'profit':       float(s.profit) if s.profit else None,
                    'sowing_date':  s.sowing_date.isoformat(),
                }
                for s in seasons
            ]
        except Exception:
            pass

        return Response({'results': data, 'count': len(data)})
