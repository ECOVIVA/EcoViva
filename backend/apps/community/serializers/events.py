from rest_framework import serializers
from apps.users.models import Users
from apps.community.models.events import *

class GincanaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Gincana
        fields = '__all__'

class GincanaCompetitorSerializer(serializers.ModelSerializer):
    members = serializers.PrimaryKeyRelatedField(many=True, queryset=Users.objects.all())

    class Meta:
        model = GincanaCompetitor
        fields = ['id', 'gincana', 'name', 'points', 'members']

class GincanaRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = GincanaRecord
        fields = [
            'id', 'gincana', 'competitor_group', 'registered_by',
            'metal_qty', 'paper_qty', 'plastic_qty', 'glass_qty',
            'collected_at'
        ]

class CampanhaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Campanha
        fields = '__all__'

class CampanhaParticipantSerializer(serializers.ModelSerializer):
    class Meta:
        model = CampanhaParticipant
        fields = ['id', 'campanha', 'user', 'joined_at']

class QuizSerializer(serializers.ModelSerializer):
    class Meta:
        model = Quiz
        fields = ['id', 'title', 'description', 'created_at', 'gincana', 'campanha']

class QuizQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuizQuestion
        fields = ['id', 'quiz', 'text']

class QuizOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuizOption
        fields = ['id', 'question', 'text', 'is_correct']

class QuizAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuizAnswer
        fields = ['id', 'user', 'question', 'selected_option', 'answered_at']
        validators = [
            serializers.UniqueTogetherValidator(
                queryset=QuizAnswer.objects.all(),
                fields=['user', 'question'],
                message="User has already answered this question."
            )
        ]
