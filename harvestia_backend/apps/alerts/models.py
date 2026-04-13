"""
HARVESTIA - Smart Alert System
Models + Alert Engine that integrates with all ML models
"""
from django.db import models
import uuid


class Alert(models.Model):
    """Smart AI-generated alert for farmers"""
    id          = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    farm        = models.ForeignKey('farms.Farm', on_delete=models.CASCADE, related_name='alerts')
    field       = models.ForeignKey('farms.Field', on_delete=models.SET_NULL, null=True, blank=True, related_name='alerts')
    user        = models.ForeignKey('accounts.CustomUser', on_delete=models.CASCADE, related_name='alerts')

    ALERT_TYPES = [
        ('disease',     'Disease Detection'),
        ('pest',        'Pest Risk'),
        ('irrigation',  'Irrigation Required'),
        ('yield',       'Yield Warning'),
        ('weather',     'Weather Alert'),
        ('soil',        'Soil Issue'),
        ('satellite',   'Satellite Anomaly'),
        ('price',       'Market Price Alert'),
        ('sensor',      'Sensor Anomaly'),
        ('harvest',     'Harvest Window'),
        ('general',     'General Advisory'),
    ]
    alert_type  = models.CharField(max_length=20, choices=ALERT_TYPES)

    SEVERITY_CHOICES = [
        ('critical', 'Critical — Immediate Action'),
        ('high',     'High — Action within 24hrs'),
        ('medium',   'Medium — Monitor'),
        ('low',      'Low — Informational'),
    ]
    severity    = models.CharField(max_length=10, choices=SEVERITY_CHOICES)

    title       = models.CharField(max_length=300)
    message     = models.TextField()
    action_required = models.TextField(blank=True)

    # AI model that triggered this alert
    ml_model    = models.CharField(max_length=50, blank=True)
    ml_confidence = models.FloatField(null=True)
    ml_payload  = models.JSONField(default=dict)  # Full ML model output

    # Financial impact estimate
    estimated_loss_inr  = models.DecimalField(max_digits=12, decimal_places=2, null=True)
    estimated_saving_inr= models.DecimalField(max_digits=12, decimal_places=2, null=True)

    # Status
    is_read       = models.BooleanField(default=False)
    is_resolved   = models.BooleanField(default=False)
    resolved_at   = models.DateTimeField(null=True)
    resolved_by   = models.ForeignKey('accounts.CustomUser', on_delete=models.SET_NULL, null=True, blank=True, related_name='resolved_alerts')
    resolution_note = models.TextField(blank=True)

    # Notification
    push_sent     = models.BooleanField(default=False)
    sms_sent      = models.BooleanField(default=False)
    email_sent    = models.BooleanField(default=False)

    expires_at    = models.DateTimeField(null=True, blank=True)
    created_at    = models.DateTimeField(auto_now_add=True)
    updated_at    = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'alerts'
        ordering = ['-created_at']
        indexes  = [
            models.Index(fields=['user', 'is_read', 'created_at']),
            models.Index(fields=['farm', 'severity', 'is_resolved']),
        ]

    def __str__(self):
        return f"[{self.severity.upper()}] {self.title}"
