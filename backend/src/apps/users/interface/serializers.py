import re

from django.contrib.auth import password_validation
from rest_framework import serializers

from apps.users.infrastructure.models.interests import Interests


class UsersReadSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    username = serializers.CharField()
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    email = serializers.CharField()
    phone = serializers.CharField()
    bio = serializers.CharField()
    photo = serializers.CharField()
    interests = serializers.SerializerMethodField()
    is_active = serializers.BooleanField()

    def get_interests(self) -> None: ...


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

    def validate_phone(self, value: str) -> str:
        if re.match(r"^\d{11}$", value):
            formatted_value = f"({value[:2]}) {value[2:7]}-{value[7:]}"
        elif re.match(r"^\(\d{2}\) \d{5}-\d{4}$", value):
            formatted_value = value
        else:
            e_msg = (
                "Número de telefone inválido. O formato correto é (XX) XXXXX-XXXX ou 119XXXXXXXX."
            )

            raise serializers.ValidationError(e_msg)

        return formatted_value

    def validate_password(self, value: str) -> str:
        try:
            password_validation.validate_password(value)
        except serializers.ValidationError as e:
            e_msg = {"password": str(e)}
            raise serializers.ValidationError(e_msg) from e
        return value

    def validate_bio(self, value: str) -> str:
        max_line_breaks = 5
        line_breaks = value.count("\n")
        if line_breaks > max_line_breaks:
            e_msg = f"Máximo de {max_line_breaks} quebras de linha permitidas."

            raise serializers.ValidationError(e_msg)
        return value
