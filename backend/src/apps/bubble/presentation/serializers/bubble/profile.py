from rest_framework import serializers


class BubbleProfileSerializer(serializers.Serializer):
    user_id = serializers.IntegerField()
    progress = serializers.FloatField()
    rank_name = serializers.CharField()
    difficulty_name = serializers.CharField()
