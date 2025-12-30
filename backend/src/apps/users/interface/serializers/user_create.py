from typing import TypedDict

from rest_framework import serializers

from apps.users.application.dtos.user import UserWriteDTO
from apps.users.application.services.user import UserFacadeFactory
from apps.users.infrastructure.models.interests import Interests


class CreateValidatedDataType(TypedDict):
    username: str
    first_name: str
    last_name: str
    password: str
    email: str
    phone: str | None
    bio: str | None
    photo: str | None
    interests: list[int] | None


class UsersWriteSerializer(serializers.Serializer):
    username = serializers.CharField()
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    password = serializers.CharField(write_only=True)
    email = serializers.CharField()
    phone = serializers.CharField(required=False)
    bio = serializers.CharField(required=False)
    photo = serializers.FileField()
    interests = serializers.SlugRelatedField(
        many=True, slug_field="name", queryset=Interests.objects.all(), required=False
    )

    def create(self, validated_data: CreateValidatedDataType) -> object:
        dto = UserWriteDTO(**validated_data)
        service = UserFacadeFactory.create()

        return service.create_user(dto)
