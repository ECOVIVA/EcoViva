from rest_framework import serializers
from . import models

class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Lesson
        fields = '__all__'

class LessonCompletionSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.LessonCompletion
        fields = ['user', 'lesson', 'completed_at']
        read_only_fields = ['completed_at']
    
    def create(self, validated_data):
        user = validated_data['user']
        lesson = validated_data['lesson']

        if models.LessonCompletion.objects.filter(user=user, lesson=lesson).exists():
            raise serializers.ValidationError("O Usuario já concluiu essa lição.")

        return super().create(validated_data)

class AchievementSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Achievement
        fields = "__all__"

class UserAchievementSerializer(serializers.ModelSerializer):
    achievement = AchievementSerializer(read_only=True)

    class Meta:
        model = models.UserAchievement
        fields = ["achievement", "unlocked_at"]