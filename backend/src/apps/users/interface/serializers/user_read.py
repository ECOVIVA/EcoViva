from rest_framework import serializers


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
