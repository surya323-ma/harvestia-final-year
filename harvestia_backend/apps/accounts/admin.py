from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    model           = CustomUser
    list_display    = ['email', 'full_name', 'role', 'plan', 'is_verified', 'date_joined']
    list_filter     = ['role', 'plan', 'is_verified', 'is_staff']
    search_fields   = ['email', 'full_name', 'district', 'state']
    ordering        = ['-date_joined']
    fieldsets = (
        (None,           {'fields': ('email', 'password')}),
        ('Personal',     {'fields': ('full_name', 'phone', 'state', 'district', 'profile_photo')}),
        ('Role & Plan',  {'fields': ('role', 'plan', 'is_verified', 'onboarding_done')}),
        ('Permissions',  {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Dates',        {'fields': ('last_login', 'date_joined', 'last_active')}),
    )
    add_fieldsets = (
        (None, {'classes': ('wide',), 'fields': ('email', 'full_name', 'password1', 'password2', 'role')}),
    )
