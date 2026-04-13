"""
HARVESTIA - Accounts Serializers
"""
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.password_validation import validate_password
from .models import CustomUser


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """JWT token with extra user claims embedded"""

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['email']     = user.email
        token['full_name'] = user.full_name
        token['role']      = user.role
        token['plan']      = user.plan
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        # Also return user data alongside tokens
        data['user'] = UserSerializer(self.user).data
        return data


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model  = CustomUser
        fields = [
            'id', 'email', 'full_name', 'phone',
            'state', 'district', 'role', 'plan',
            'profile_photo', 'is_verified', 'onboarding_done',
            'last_active', 'date_joined',
        ]
        read_only_fields = ['id', 'email', 'is_verified', 'date_joined', 'last_active']


class RegisterSerializer(serializers.ModelSerializer):
    password  = serializers.CharField(write_only=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model  = CustomUser
        fields = ['email', 'full_name', 'phone', 'state', 'district', 'role', 'password', 'password2']

    def validate(self, data):
        if data['password'] != data.pop('password2'):
            raise serializers.ValidationError({'password': 'Passwords do not match.'})
        return data

    def create(self, validated_data):
        return CustomUser.objects.create_user(**validated_data)


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True, validators=[validate_password])
