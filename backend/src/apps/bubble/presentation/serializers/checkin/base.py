from rest_framework import serializers


class CheckInSerializer(serializers.Serializer):
    bubble = serializers.IntegerField()
    description = serializers.CharField()
    xp_earned = serializers.IntegerField()
    created_at = serializers.DateTimeField()
