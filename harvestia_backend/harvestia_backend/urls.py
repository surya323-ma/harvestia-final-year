"""HARVESTIA - Master URL Configuration"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView, SpectacularRedocView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

@api_view(['GET'])
@permission_classes([AllowAny])
def health_check(request):
    """GET /api/health/ — backend status ping"""
    return Response({'status': 'ok', 'version': '1.0.0', 'service': 'harvestia'})

api_v1_patterns = [
    path('auth/',        include('apps.accounts.urls')),
    path('farms/',       include('apps.farms.urls')),
    path('crops/',       include('apps.crops.urls')),
    path('analytics/',   include('apps.analytics.urls')),
    path('ml/',          include('apps.analytics.ml_urls')),
    path('iot/',         include('apps.iot.urls')),
    path('alerts/',      include('apps.alerts.urls')),
    path('marketplace/', include('apps.marketplace.urls')),
]

urlpatterns = [
    path('admin/',       admin.site.urls),
    path('api/health/',  health_check,                                        name='health'),
    path('api/v1/',      include(api_v1_patterns)),
    path('api/schema/',  SpectacularAPIView.as_view(),                        name='schema'),
    path('api/docs/',    SpectacularSwaggerView.as_view(url_name='schema'),   name='swagger-ui'),
    path('api/redoc/',   SpectacularRedocView.as_view(url_name='schema'),     name='redoc'),
]

# Optional debug toolbar
if settings.DEBUG:
    try:
        import debug_toolbar
        urlpatterns += [path('__debug__/', include(debug_toolbar.urls))]
    except ImportError:
        pass

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
