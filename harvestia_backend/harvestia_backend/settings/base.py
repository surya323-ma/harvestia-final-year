"""HARVESTIA - Base Settings"""
import os
from pathlib import Path
from datetime import timedelta

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

BASE_DIR   = Path(__file__).resolve().parent.parent.parent
SECRET_KEY = os.environ.get('SECRET_KEY', 'django-insecure-harvestia-change-in-production-xyz123')
DEBUG      = False
ALLOWED_HOSTS = os.environ.get('ALLOWED_HOSTS', 'localhost,127.0.0.1').split(',')

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    # Third-party
    'rest_framework',
    'rest_framework_simplejwt',
    'rest_framework_simplejwt.token_blacklist',
    'corsheaders',
    'channels',
    'django_filters',
    'drf_spectacular',
    # Harvestia Apps
    'apps.accounts',
    'apps.farms',
    'apps.crops',
    'apps.analytics',
    'apps.iot',
    'apps.alerts',
    'apps.marketplace',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF       = 'harvestia_backend.urls'
AUTH_USER_MODEL    = 'accounts.CustomUser'
ASGI_APPLICATION   = 'harvestia_backend.asgi.application'
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

TEMPLATES = [{'BACKEND': 'django.template.backends.django.DjangoTemplates',
              'DIRS': [], 'APP_DIRS': True,
              'OPTIONS': {'context_processors': [
                  'django.template.context_processors.debug',
                  'django.template.context_processors.request',
                  'django.contrib.auth.context_processors.auth',
                  'django.contrib.messages.context_processors.messages',
              ]}}]

# ── REST Framework ─────────────────────────────────────────────
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_FILTER_BACKENDS': [
        'django_filters.rest_framework.DjangoFilterBackend',
        'rest_framework.filters.SearchFilter',
        'rest_framework.filters.OrderingFilter',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
}

# ── JWT ────────────────────────────────────────────────────────
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME':  timedelta(hours=1),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS':  True,
    'BLACKLIST_AFTER_ROTATION': True,
    'AUTH_HEADER_TYPES': ('Bearer',),
}

# ── Spectacular (Swagger) ──────────────────────────────────────
SPECTACULAR_SETTINGS = {
    'TITLE': 'Harvestia AgriTech API',
    'DESCRIPTION': '7 ML Models + IoT + Real-time WebSocket',
    'VERSION': '1.0.0',
    'SERVE_INCLUDE_SCHEMA': False,
}

# ── Static & Media ─────────────────────────────────────────────
STATIC_URL   = '/static/'
STATIC_ROOT  = BASE_DIR / 'staticfiles'
MEDIA_URL    = '/media/'
MEDIA_ROOT   = BASE_DIR / 'media'
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# ── Internationalization ───────────────────────────────────────
LANGUAGE_CODE = 'en-us'
TIME_ZONE     = 'Asia/Kolkata'
USE_I18N      = True
USE_TZ        = True

# ── CORS ───────────────────────────────────────────────────────
CORS_ALLOWED_ORIGINS = [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://127.0.0.1:3000',
]
CORS_ALLOW_CREDENTIALS = True

# ── Channels (WebSocket) ───────────────────────────────────────
CHANNEL_LAYERS = {
    'default': {'BACKEND': 'channels.layers.InMemoryChannelLayer'}
}

# ── Cache ──────────────────────────────────────────────────────
CACHES = {
    'default': {'BACKEND': 'django.core.cache.backends.locmem.LocMemCache'}
}

# ── Email ──────────────────────────────────────────────────────
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

# ── Auth Password validators ───────────────────────────────────
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
     'OPTIONS': {'min_length': 6}},
]

# ── ML Model Paths (fallback = empty → uses scikit-learn fallback) ──
ML_CONFIG = {
    'YIELD_MODEL_PATH':      '',
    'YIELD_SCALER_PATH':     '',
    'DISEASE_MODEL_PATH':    '',
    'IRRIGATION_MODEL_PATH': '',
    'PEST_MODEL_PATH':       '',
    'SOIL_MODEL_PATH':       '',
    'PRICE_MODEL_PATH':      '',
    'ANOMALY_MODEL_PATH':    '',
}
