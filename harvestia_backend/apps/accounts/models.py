"""
HARVESTIA - Custom User & Subscription Models
"""
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models
from django.utils.translation import gettext_lazy as _
import uuid


class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra):
        if not email:
            raise ValueError('Email is required')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra):
        extra.setdefault('is_staff', True)
        extra.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra)


class CustomUser(AbstractUser):
    """Extended user with AgriTech-specific fields"""
    id            = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    username      = None
    email         = models.EmailField(_('email address'), unique=True)
    full_name     = models.CharField(max_length=200)
    phone         = models.CharField(max_length=20, blank=True)
    state         = models.CharField(max_length=100, blank=True)
    district      = models.CharField(max_length=100, blank=True)

    ROLE_CHOICES = [
        ('farmer',     'Farmer'),
        ('enterprise', 'Agri Enterprise'),
        ('advisor',    'Field Advisor'),
        ('researcher', 'Researcher'),
        ('admin',      'Platform Admin'),
    ]
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='farmer')

    PLAN_CHOICES = [
        ('free',       'Free (2 fields)'),
        ('basic',      'Basic Rs499/mo'),
        ('pro',        'Pro Rs1499/mo'),
        ('enterprise', 'Enterprise Custom'),
    ]
    plan = models.CharField(max_length=20, choices=PLAN_CHOICES, default='free')

    profile_photo   = models.ImageField(upload_to='profiles/', blank=True)
    is_verified     = models.BooleanField(default=False)
    last_active     = models.DateTimeField(null=True, blank=True)
    onboarding_done = models.BooleanField(default=False)

    USERNAME_FIELD  = 'email'
    REQUIRED_FIELDS = ['full_name']
    objects = CustomUserManager()

    class Meta:
        verbose_name = 'User'
        db_table = 'harvestia_users'

    def __str__(self):
        return f"{self.full_name} ({self.email})"

    @property
    def max_fields(self):
        return {'free': 2, 'basic': 10, 'pro': 50, 'enterprise': 999}[self.plan]


class UserActivity(models.Model):
    """Track user actions for analytics"""
    user       = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='activities')
    action     = models.CharField(max_length=100)
    metadata   = models.JSONField(default=dict)
    ip_address = models.GenericIPAddressField(null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        indexes  = [models.Index(fields=['user', 'action', 'created_at'])]
