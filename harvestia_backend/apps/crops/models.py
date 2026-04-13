"""
HARVESTIA - Crop Lifecycle Models
Tracks sowing → growth → harvest with AI scoring
"""
from django.db import models
import uuid


class CropSeason(models.Model):
    """A single crop growing season for a field"""
    id     = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    field  = models.ForeignKey('farms.Field', on_delete=models.CASCADE, related_name='crop_seasons')
    farmer = models.ForeignKey('accounts.CustomUser', on_delete=models.CASCADE, related_name='crop_seasons')

    CROP_CHOICES = [
        ('wheat',      'Wheat'),
        ('rice',       'Rice / Paddy'),
        ('cotton',     'Cotton'),
        ('soybean',    'Soybean'),
        ('corn',       'Corn / Maize'),
        ('sugarcane',  'Sugarcane'),
        ('mustard',    'Mustard'),
        ('groundnut',  'Groundnut'),
        ('turmeric',   'Turmeric'),
        ('tomato',     'Tomato'),
        ('onion',      'Onion'),
        ('potato',     'Potato'),
        ('chickpea',   'Chickpea'),
        ('lentil',     'Lentil / Dal'),
        ('other',      'Other'),
    ]
    crop_type  = models.CharField(max_length=30, choices=CROP_CHOICES)
    variety    = models.CharField(max_length=100, blank=True, help_text='Seed variety/brand')

    SEASON_CHOICES = [
        ('kharif',  'Kharif (Jun–Oct)'),
        ('rabi',    'Rabi (Nov–Apr)'),
        ('zaid',    'Zaid (Mar–Jun)'),
        ('perennial','Perennial'),
    ]
    season     = models.CharField(max_length=20, choices=SEASON_CHOICES)
    year       = models.IntegerField()

    # Timeline
    sowing_date    = models.DateField()
    expected_harvest_date = models.DateField(null=True, blank=True)
    actual_harvest_date   = models.DateField(null=True, blank=True)

    # Stage tracking
    STAGE_CHOICES = [
        ('pre_sowing',   'Pre-Sowing'),
        ('sowing',       'Sowing'),
        ('germination',  'Germination'),
        ('seedling',     'Seedling'),
        ('vegetative',   'Vegetative'),
        ('flowering',    'Flowering'),
        ('grain_fill',   'Grain Filling'),
        ('maturity',     'Maturity'),
        ('harvest_ready','Harvest Ready'),
        ('harvested',    'Harvested'),
    ]
    current_stage = models.CharField(max_length=20, choices=STAGE_CHOICES, default='sowing')

    # Economics
    seed_cost_per_acre   = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    fertilizer_cost      = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    pesticide_cost       = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    irrigation_cost      = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    labour_cost          = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    other_cost           = models.DecimalField(max_digits=10, decimal_places=2, null=True, default=0)

    # Yield & Revenue
    actual_yield_tons    = models.DecimalField(max_digits=10, decimal_places=3, null=True)
    selling_price_per_ton= models.DecimalField(max_digits=10, decimal_places=2, null=True)
    total_revenue        = models.DecimalField(max_digits=12, decimal_places=2, null=True)

    is_active  = models.BooleanField(default=True)
    notes      = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'crop_seasons'
        ordering = ['-sowing_date']
        unique_together = ['field', 'season', 'year']

    def __str__(self):
        return f"{self.crop_type} | {self.field.name} | {self.season} {self.year}"

    @property
    def total_cost(self):
        costs = [self.seed_cost_per_acre, self.fertilizer_cost, self.pesticide_cost,
                 self.irrigation_cost, self.labour_cost, self.other_cost]
        return sum(c for c in costs if c)

    @property
    def profit(self):
        if self.total_revenue and self.total_cost:
            return float(self.total_revenue) - float(self.total_cost)
        return None


class GrowthLog(models.Model):
    """Daily/weekly crop observation logs"""
    id          = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    crop_season = models.ForeignKey(CropSeason, on_delete=models.CASCADE, related_name='growth_logs')
    log_date    = models.DateField()

    plant_height_cm  = models.FloatField(null=True)
    leaf_count       = models.IntegerField(null=True)
    canopy_cover_pct = models.FloatField(null=True)
    chlorophyll_spad = models.FloatField(null=True, help_text='SPAD value')

    # Observations
    pest_observed    = models.BooleanField(default=False)
    disease_observed = models.BooleanField(default=False)
    stress_signs     = models.BooleanField(default=False)
    observation_notes= models.TextField(blank=True)

    # Photo attachments
    field_photo      = models.ImageField(upload_to='growth_logs/', blank=True)

    # AI analysis of photo (if uploaded)
    ai_analysis      = models.JSONField(default=dict)
    ai_health_score  = models.FloatField(null=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'growth_logs'
        ordering = ['-log_date']
        unique_together = ['crop_season', 'log_date']


class InputApplication(models.Model):
    """Record of fertilizer / pesticide / irrigation applications"""
    id          = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    crop_season = models.ForeignKey(CropSeason, on_delete=models.CASCADE, related_name='inputs')
    applied_date= models.DateField()

    INPUT_TYPES = [
        ('fertilizer', 'Fertilizer'),
        ('pesticide',  'Pesticide'),
        ('herbicide',  'Herbicide'),
        ('fungicide',  'Fungicide'),
        ('irrigation', 'Irrigation'),
        ('growth_reg', 'Growth Regulator'),
        ('micronutrient','Micronutrient'),
        ('organic',    'Organic Input'),
    ]
    input_type  = models.CharField(max_length=20, choices=INPUT_TYPES)
    product_name= models.CharField(max_length=200)
    quantity    = models.FloatField()
    unit        = models.CharField(max_length=20)  # kg, L, ml, etc.
    cost        = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    applied_by  = models.CharField(max_length=100, blank=True)
    method      = models.CharField(max_length=100, blank=True)
    notes       = models.TextField(blank=True)
    created_at  = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'input_applications'
        ordering = ['-applied_date']
