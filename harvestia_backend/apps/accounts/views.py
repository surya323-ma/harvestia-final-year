"""
HARVESTIA - Accounts Views
Auth: Login, Register, Logout, Profile, Change Password
"""
from rest_framework import status, generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from django.utils import timezone

from .models import CustomUser
from .serializers import (
    CustomTokenObtainPairSerializer,
    UserSerializer,
    RegisterSerializer,
    ChangePasswordSerializer,
)


class LoginView(TokenObtainPairView):
    """POST /api/v1/auth/login/  →  {access, refresh, user}"""
    serializer_class = CustomTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        # Update last_active timestamp
        if response.status_code == 200:
            try:
                user = CustomUser.objects.get(email=request.data.get('email'))
                user.last_active = timezone.now()
                user.save(update_fields=['last_active'])
            except CustomUser.DoesNotExist:
                pass
        return response


class RegisterView(generics.CreateAPIView):
    """POST /api/v1/auth/register/  →  {access, refresh, user}"""
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        # Generate tokens immediately on register
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access':  str(refresh.access_token),
            'user':    UserSerializer(user).data,
        }, status=status.HTTP_201_CREATED)


class ProfileView(generics.RetrieveUpdateAPIView):
    """GET/PATCH /api/v1/auth/profile/"""
    serializer_class   = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def logout_view(request):
    """POST /api/v1/auth/logout/  — blacklists the refresh token"""
    try:
        token = RefreshToken(request.data.get('refresh'))
        token.blacklist()
        return Response({'detail': 'Logged out successfully.'}, status=status.HTTP_205_RESET_CONTENT)
    except TokenError:
        return Response({'detail': 'Invalid or expired token.'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def change_password_view(request):
    """POST /api/v1/auth/change-password/"""
    serializer = ChangePasswordSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    user = request.user
    if not user.check_password(serializer.validated_data['old_password']):
        return Response({'old_password': 'Wrong password.'}, status=status.HTTP_400_BAD_REQUEST)

    user.set_password(serializer.validated_data['new_password'])
    user.save()
    return Response({'detail': 'Password changed successfully.'})
