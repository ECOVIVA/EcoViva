from typing import TypedDict

from rest_framework import serializers

from apps.users.application.dtos.user import UserReadDTO, UserUpdateDTO
from apps.users.application.services.user import UserFacadeFactory


class UpdateValidatedDataType(TypedDict, total=False):
    first_name: str
    last_name: str
    phone: str | None
    bio: str | None


class UsersUpdateSerializer(serializers.Serializer):
    first_name = serializers.CharField(required=False)
    last_name = serializers.CharField(required=False)
    phone = serializers.CharField(required=False)
    bio = serializers.CharField(required=False)

    def update(self, instance: UserReadDTO, validated_data: UpdateValidatedDataType) -> UserReadDTO:
        dto = UserUpdateDTO(**validated_data)
        return UserFacadeFactory.create().update_user(instance.id, dto)
