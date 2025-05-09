from rest_framework import serializers

from .models import User


class ProfileUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("username", "email", "email_verified", "is_active")
