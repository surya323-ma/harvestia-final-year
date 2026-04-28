"""HARVESTIA - Development Settings (Windows/Mac/Linux - SQLite)"""
import os
from .base import *

DEBUG         = False
ALLOWED_HOSTS = ['*']
CORS_ALLOW_ALL_ORIGINS = True

# SQLite — zero setup needed
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME':    BASE_DIR / 'db.sqlite3',
    }
}

EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'simple': {'format': '[%(levelname)s] %(name)s: %(message)s'},
    },
    'handlers': {
        'console': {'class': 'logging.StreamHandler', 'formatter': 'simple'},
    },
    'root':    {'handlers': ['console'], 'level': 'INFO'},
    'loggers': {
        'django.db.backends': {'level': 'WARNING'},
        'harvestia':          {'level': 'DEBUG', 'handlers': ['console'], 'propagate': False},
    },
}
