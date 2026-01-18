from rest_framework import serializers

from apps.bubble.application.dtos.check_in import CheckInCreateDTO


class CheckInCreateSerializer(serializers.Serializer):
    bubble = serializers.IntegerField()
    description = serializers.CharField(min_length=3)

    def create_dto(self) -> CheckInCreateDTO:
        validated_data = self.validated_data

        return CheckInCreateDTO(
            bubble_id=validated_data["bubble"],
            description=validated_data["description"],
        )
