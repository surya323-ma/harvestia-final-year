#!/usr/bin/env python
"""
HARVESTIA — Demo Data Seeder
Run: python seed_demo_data.py
"""
import os, sys, django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'harvestia_backend.settings.development')
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
django.setup()

from datetime import date, timedelta
import random
random.seed(42)

from apps.accounts.models import CustomUser
from apps.farms.models import Farm, Field
from apps.crops.models import CropSeason
from apps.alerts.models import Alert
from apps.marketplace.models import ProductCategory, Product

print("\n🌱 Seeding Harvestia demo data...\n")

# ── 1. Demo User ───────────────────────────────────────────────
user, created = CustomUser.objects.get_or_create(
    email='demo@harvestia.in',
    defaults={
        'full_name':       'Rajesh Kumar',
        'phone':           '+91-9876543210',
        'state':           'Maharashtra',
        'district':        'Pune',
        'role':            'farmer',
        'plan':            'pro',
        'is_verified':     True,
        'onboarding_done': True,
        'is_active':       True,
    }
)
if created:
    user.set_password('demo@123')
    user.save()
    print("  ✅ User created: demo@harvestia.in / demo@123")
else:
    print("  ℹ️  User already exists: demo@harvestia.in")

# ── 2. Farm ────────────────────────────────────────────────────
farm, _ = Farm.objects.get_or_create(
    owner=user, name='Rajesh Kumar Farm',
    defaults={
        'total_area':   24.5,
        'location_lat': 18.5204,
        'location_lng': 73.8567,
        'village':      'Uruli Kanchan',
        'district':     'Pune',
        'state':        'Maharashtra',
        'pincode':      '412202',
    }
)
print(f"  ✅ Farm: {farm.name}")

# ── 3. Fields ─────────────────────────────────────────────────
fields_data = [
    {'name': 'North Block A', 'area_acres': 6.5, 'soil_type': 'black',   'irrigation_type': 'drip',       'soil_ph': 6.8},
    {'name': 'East Block B',  'area_acres': 5.0, 'soil_type': 'alluvial','irrigation_type': 'sprinkler',  'soil_ph': 7.1},
    {'name': 'South Block C', 'area_acres': 7.0, 'soil_type': 'loam',    'irrigation_type': 'drip',       'soil_ph': 6.5},
    {'name': 'West Block D',  'area_acres': 6.0, 'soil_type': 'red',     'irrigation_type': 'flood',      'soil_ph': 6.9},
]
field_objects = []
for fd in fields_data:
    f, _ = Field.objects.get_or_create(farm=farm, name=fd['name'], defaults=fd)
    field_objects.append(f)
print(f"  ✅ {len(field_objects)} fields")

# ── 4. Crop Seasons ───────────────────────────────────────────
crops_cfg = [
    ('wheat',   'rabi',   field_objects[0], 'grain_fill'),
    ('soybean', 'kharif', field_objects[1], 'flowering'),
    ('cotton',  'kharif', field_objects[2], 'vegetative'),
    ('onion',   'rabi',   field_objects[3], 'seedling'),
]
for crop, season, field, stage in crops_cfg:
    CropSeason.objects.get_or_create(
        field=field, season=season, year=2025,
        defaults={
            'farmer':             user,
            'crop_type':          crop,
            'sowing_date':        date(2025, 11, 1),
            'current_stage':      stage,
            'seed_cost_per_acre': random.randint(1500, 4000),
            'fertilizer_cost':    random.randint(4000, 9000),
            'is_active':          True,
        }
    )
print(f"  ✅ {len(crops_cfg)} crop seasons")

# ── 5. Alerts ─────────────────────────────────────────────────
alerts = [
    ('disease',   'critical', 'Wheat Blast Detected — North Block A',
     'AI model detected 87% probability of wheat blast. Apply Trifloxystrobin 25% WG @ 0.5g/L within 24 hours.',
     'Apply Trifloxystrobin + Tebuconazole fungicide immediately.', 'disease_cnn_resnet50', 0.87),
    ('irrigation','high',     'Soil Moisture Low — East Block B',
     'Soil moisture at 28% — below critical threshold of 35%. IoT sensor confirmed.',
     'Start drip irrigation for 2 hours. Est. water: 450L/acre.', 'irrigation_rl_agent', 0.92),
    ('pest',      'medium',   'Aphid Risk Moderate — South Block C',
     'XGBoost model forecasts 65% aphid risk in next 7 days.',
     'Apply Imidacloprid 70% WG @ 0.5g/L preventively.', 'pest_risk_xgboost', 0.65),
    ('weather',   'medium',   'Heavy Rain Forecast — All Fields',
     'IMD forecast: 45-65mm rainfall in next 48 hours.',
     'Postpone urea top-dressing by 3 days. Check drainage.', 'weather_api', 0.78),
    ('yield',     'low',      'Yield Forecast Updated — Wheat Season',
     'AI model revised wheat yield to 4.2 t/ha (+8% vs last estimate).',
     'Continue current management. Pre-book mandi slot.', 'yield_predictor_v3', 0.91),
]
alert_count = 0
for atype, sev, title, msg, action, model, conf in alerts:
    _, created = Alert.objects.get_or_create(
        user=user, title=title,
        defaults={
            'farm': farm, 'field': field_objects[0],
            'alert_type': atype, 'severity': sev,
            'message': msg, 'action_required': action,
            'ml_model': model, 'ml_confidence': conf,
        }
    )
    if created: alert_count += 1
print(f"  ✅ {alert_count} alerts created")

# ── 6. Marketplace Products ───────────────────────────────────
categories = [
    ('tractor',   'Tractors',   '🚜'),
    ('harvester', 'Harvesters', '🌾'),
    ('tipper',    'Tippers',    '🚛'),
    ('seed',      'Seeds',      '🌱'),
    ('tool',      'Tools',      '🔧'),
]
cat_objs = {}
for slug, name, icon in categories:
    cat, _ = ProductCategory.objects.get_or_create(slug=slug, defaults={'name': name, 'icon': icon})
    cat_objs[slug] = cat

products = [
    ('tractor',   'Lindner', 'Lintrac 90',          75000,  56250, 4.7, 128, 'BESTSELLER', '🚜', {'HP':'102','Drive':'4WD','PTO':'540/1000 RPM'}),
    ('tractor',   'Mahindra','Arjun 605 DI',         820000, None,  4.8, 342, 'POPULAR',    '🚜', {'HP':'57','Drive':'2WD/4WD','PTO':'540 RPM'}),
    ('tractor',   'John Deere','5050D',              950000, 890000,4.6, 215, 'SALE',       '🚜', {'HP':'50','Drive':'4WD'}),
    ('harvester', 'Claas',   'Lexion 770',         5200000,4800000, 4.9, 67,  'PREMIUM',    '🌾', {'Tank':'17000L','Header':'9.2m'}),
    ('harvester', 'PREET',   '987 Combine',        1800000,1620000, 4.4, 183, 'SALE',       '🌾', {'Tank':'2500L','Header':'3.6m'}),
    ('tipper',    'Tata',    'Prima 4028.S',       3200000,2950000, 4.6, 156, 'SALE',       '🚛', {'Payload':'25000kg','Axles':'Tri-axle'}),
    ('tipper',    'Mahindra','Blazo 37 Tipper',    2800000, None,   4.5, 78,  'POPULAR',    '🚛', {'Payload':'20000kg','Axles':'Bi-axle'}),
    ('seed',      'Kaveri',  'Hybrid Wheat KW-317',   1200, None,   4.8, 892, 'BESTSELLER', '🌾', {'Yield':'6.5t/ha','Bag':'40kg','Season':'Rabi'}),
    ('seed',      'Syngenta','NK-6240 Maize',          3500, 3150,  4.7, 567, 'SALE',       '🌽', {'Yield':'9.2t/ha','Bag':'20kg','Season':'Kharif'}),
    ('seed',      'Bayer',   'Arize 6444 Gold Rice',   2800, None,  4.9,1240, 'TOP RATED',  '🍚', {'Yield':'8.5t/ha','Bag':'6kg'}),
    ('tool',      'Fieldking','Heavy Rotavator 6ft',  85000, 76500, 4.6, 289, 'SALE',       '🔧', {'Width':'6ft','Blades':'48 L-type'}),
    ('tool',      'Sonalika','Multi-Crop Thresher',   45000, None,  4.4, 167, 'NEW',        '⚙️', {'Output':'800kg/hr','Power':'7.5HP'}),
]
prod_count = 0
for slug, brand, name, price, sale, rating, reviews, badge, emoji, specs in products:
    _, created = Product.objects.get_or_create(
        brand=brand, name=name,
        defaults={
            'category':     cat_objs[slug],
            'price':        price,
            'sale_price':   sale,
            'rating':       rating,
            'review_count': reviews,
            'badge':        badge,
            'emoji':        emoji,
            'specs':        specs,
            'is_active':    True,
            'stock':        10,
        }
    )
    if created: prod_count += 1
print(f"  ✅ {prod_count} marketplace products")

print("\n" + "━"*50)
print("  ✅ Demo data seeded successfully!")
print("━"*50)
print(f"  Login:    demo@harvestia.in")
print(f"  Password: demo@123")
print(f"  Farm:     {farm.name}")
print(f"  Swagger:  http://localhost:8000/api/docs/")
print("━"*50 + "\n")
