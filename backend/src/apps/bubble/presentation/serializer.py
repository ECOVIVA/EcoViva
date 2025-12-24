from datetime import timedelta
from typing import cast

from django.utils import timezone
from rest_framework import serializers

from apps.bubble.infrastructure.model import Bubble, CheckIn, Difficulty, Rank


class DifficultySerializer(serializers.ModelSerializer):
    class Meta:  # type: ignore
        model = Difficulty
        fields = ("name", "points_for_activity")


class RankSerializer(serializers.ModelSerializer):
    difficulty = DifficultySerializer()

    class Meta:  # type: ignore
        model = Rank
        fields = ("name", "difficulty", "points")


class BubbleSerializer(serializers.ModelSerializer):
    rank = RankSerializer()
    check_ins = serializers.SerializerMethodField()

    class Meta:  # type: ignore
        model = Bubble
        fields = ("user", "progress", "rank", "check_ins")
        read_only_fields = ("rank", "check_ins")

    def get_check_ins(self, obj: Bubble) -> object:
        check_ins = obj.check_ins.all()
        return CheckInSerializer(check_ins, many=True).data


class CheckInSerializer(serializers.ModelSerializer):
    class Meta:  # type: ignore
        model = CheckIn
        fields = "__all__"
        read_only_fields = ("created_at", "xp_earned")

    def validate(self, attrs: dict[str, object]) -> dict[str, object]:
        bubble = attrs.get("bubble")
        ultimo_checkin = CheckIn.objects.filter(bubble=bubble).order_by("-created_at").first()

        if ultimo_checkin:
            tempo_desde_ultimo = timezone.now() - ultimo_checkin.created_at
            if tempo_desde_ultimo < timedelta(days=1):
                error_message = "Um novo Check-in só pode ser feito após 24 horas."
                raise serializers.ValidationError({"non_field_errors": [error_message]})

        return attrs

    def create(self, validated_data: dict[str, object]) -> dict[str, object]:
        bubble = cast("Bubble", validated_data.get("bubble"))
        validated_data["xp_earned"] = bubble.rank.difficulty.points_for_activity
        return super().create(validated_data)
