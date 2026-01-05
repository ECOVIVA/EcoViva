from typing import TypedDict

from django.contrib.auth import authenticate
from rest_framework import serializers


class Data(TypedDict):
    email: str
    password: str


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True)

    def validate(self, attrs: dict[str, object]) -> dict[str, object]:
        user = authenticate(email=attrs["email"], password=attrs["password"])

        if user:
            return attrs

        raise serializers.ValidationError({"detail": "Usuário ou senha incorretos!!"})
