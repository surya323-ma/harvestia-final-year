from django.contrib import admin
from .models import Alert

@admin.register(Alert)
class AlertAdmin(admin.ModelAdmin):
    list_display  = ['title', 'user', 'alert_type', 'severity', 'is_read', 'is_resolved', 'created_at']
    list_filter   = ['alert_type', 'severity', 'is_read', 'is_resolved']
    search_fields = ['title', 'user__email']
    ordering      = ['-created_at']
