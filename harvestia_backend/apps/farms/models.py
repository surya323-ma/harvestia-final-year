"""
HARVESTIA - Farm & Field Models
Windows/SQLite compatible (GIS removed)
"""
from django.db import models
import uuid


class Farm(models.Model):
    id         = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    owner      = models.ForeignKey('accounts.CustomUser', on_delete=models.CASCADE, related_name='farms')
    name       = models.CharField(max_length=200)
    description= models.TextField(blank=True)
    total_area = models.DecimalField(max_digits=10, decimal_places=2, help_text='acres')

    location_lat = models.FloatField()
    location_lng = models.FloatField()
    village      = models.CharField(max_length=100, blank=True)
    district     = models.CharField(max_length=100)
    state        = models.CharField(max_length=100)
    pincode      = models.CharField(max_length=10, blank=True)

    is_active  = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        db_table = 'farms'

    def __str__(self):
        return f"{self.name} — {self.owner.full_name}"

    @property
    def field_count(self):
        return self.fields.count()


class Field(models.Model):
    id   = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    farm = models.ForeignKey(Farm, on_delete=models.CASCADE, related_name='fields')
    name = models.CharField(max_length=100)

    # boundary stored as JSON string (lat/lng pairs) — no GDAL needed
    boundary_json = models.TextField(blank=True, default='', help_text='GeoJSON boundary as text')
    area_acres    = models.DecimalField(max_digits=8, decimal_places=2)

    SOIL_TYPES = [
        ('clay','Clay'),('loam','Loam'),('sandy','Sandy'),('silt','Silt'),
        ('clay_loam','Clay Loam'),('sandy_loam','Sandy Loam'),
        ('black','Black Cotton Soil'),('red','Red Laterite'),('alluvial','Alluvial'),
    ]
    soil_type      = models.CharField(max_length=20, choices=SOIL_TYPES, blank=True)
    soil_ph        = models.FloatField(null=True, blank=True)
    organic_matter = models.FloatField(null=True, blank=True)

    IRRIGATION_TYPES = [
        ('drip','Drip'),('sprinkler','Sprinkler'),('flood','Flood'),
        ('rainfed','Rain-fed'),('canal','Canal'),('none','None'),
    ]
    irrigation_type         = models.CharField(max_length=20, choices=IRRIGATION_TYPES, default='drip')
    water_source            = models.CharField(max_length=100, blank=True)
    irrigation_capacity_lph = models.FloatField(null=True, blank=True)

    is_fallow  = models.BooleanField(default=False)
    last_crop  = models.CharField(max_length=100, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'fields'
        ordering = ['name']

    def __str__(self):
        return f"{self.name} ({self.farm.name}) — {self.area_acres} ac"

    @property
    def current_crop(self):
        return self.crop_seasons.filter(is_active=True).first()


class SoilReport(models.Model):
    id         = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    field      = models.ForeignKey(Field, on_delete=models.CASCADE, related_name='soil_reports')
    tested_by  = models.CharField(max_length=100, blank=True)
    test_date  = models.DateField()

    nitrogen   = models.FloatField(null=True)
    phosphorus = models.FloatField(null=True)
    potassium  = models.FloatField(null=True)
    zinc       = models.FloatField(null=True)
    iron       = models.FloatField(null=True)
    manganese  = models.FloatField(null=True)
    boron      = models.FloatField(null=True)
    copper     = models.FloatField(null=True)
    ph         = models.FloatField(null=True)
    ec         = models.FloatField(null=True)
    organic_carbon     = models.FloatField(null=True)
    ai_health_score    = models.FloatField(null=True)
    ai_recommendations = models.JSONField(default=list)
    report_file        = models.FileField(upload_to='soil_reports/', blank=True)
    created_at         = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'soil_reports'
        ordering = ['-test_date']
