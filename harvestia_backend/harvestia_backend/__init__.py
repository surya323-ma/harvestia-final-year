# Try Celery — optional, only needed in production
try:
    from .celery import app as celery_app
    __all__ = ('celery_app',)
except Exception:
    pass
