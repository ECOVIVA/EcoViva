from typing import TypedDict

from rest_framework import serializers

from apps.bubble.application.service.checkin import CheckInService
from apps.bubble.domain.entities.checkin import CheckInEntity


class CheckInCreateData(TypedDict):
    bubble: int
    description: str


class CheckInCreateSerializer(serializers.Serializer):
    bubble = serializers.IntegerField()
    description = serializers.CharField(min_length=3)

    def create(self, validated_data: CheckInCreateData) -> CheckInEntity:
        service = CheckInService()
        return service.create(
            bubble_id=validated_data["bubble"],
            description=validated_data["description"],
        )


class CheckInSerializer(serializers.Serializer):
    bubble = serializers.IntegerField()
    description = serializers.CharField()
    xp_earned = serializers.IntegerField()
    created_at = serializers.DateTimeField()


class BubbleProfileSerializer(serializers.Serializer):
    user_id = serializers.IntegerField()
    progress = serializers.FloatField()
    rank_name = serializers.CharField()
    difficulty_name = serializers.CharField()
