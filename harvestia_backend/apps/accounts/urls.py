"""HARVESTIA - Auth URL patterns"""
from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import LoginView, RegisterView, ProfileView, logout_view, change_password_view

urlpatterns = [
    path('login/',           LoginView.as_view(),          name='auth-login'),
    path('register/',        RegisterView.as_view(),        name='auth-register'),
    path('logout/',          logout_view,                   name='auth-logout'),
    path('refresh/',         TokenRefreshView.as_view(),    name='auth-refresh'),
    path('profile/',         ProfileView.as_view(),         name='auth-profile'),
    path('change-password/', change_password_view,          name='auth-change-password'),
]
