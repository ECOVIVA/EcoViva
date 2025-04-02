from rest_framework import serializers
from django.utils import timezone
from datetime import timedelta

from . import models

"""
    Serializers responsáveis pela conversão dos dados dos models em JSON e vice-versa.

    Este arquivo contém os serializers de Bubble, CheckIn, Difficulty e Rank, validando dados e realizando operações no banco de dados.
"""

class DifficultySerializer(serializers.ModelSerializer):
    """ Serializa o modelo de dificuldade. """
    class Meta:
        model = models.Difficulty
        fields = '__all__'

class RankSerializer(serializers.ModelSerializer):
    """ Serializa o modelo de ranking, incluindo os dados da dificuldade associada. """
    difficulty = DifficultySerializer()
    
    class Meta:
        model = models.Rank
        fields = '__all__'

class CheckInSerializer(serializers.ModelSerializer):
    """ Serializa o modelo de Check-In e implementa validações. """
    
    class Meta:
        model = models.CheckIn
        fields = '__all__'
        read_only_fields = ['created_at', 'xp_earned']

    def validate(self, data):
        """ Valida se o último Check-In foi feito há menos de 24 horas. """
        bubble = data.get('bubble')  
        ultimo_checkin = models.CheckIn.objects.filter(bubble=bubble).order_by('-created_at').first()

        if ultimo_checkin:
            tempo_desde_ultimo = timezone.now() - ultimo_checkin.created_at
            if tempo_desde_ultimo < timedelta(days=1):
                raise serializers.ValidationError("Um novo Check-in só pode ser feito após 24 horas.")

        return data
    
    def create(self, validated_data):
        """ Atribui XP automaticamente ao criar um Check-In. """
        bubble = validated_data.get('bubble')
        validated_data['xp_earned'] = bubble.rank.difficulty.points_for_activity
        return super().create(validated_data)
    
class BubbleSerializer(serializers.ModelSerializer):
    """ Serializa o modelo de Bubble, incluindo rank e check-ins associados. """
    rank = RankSerializer()
    check_ins = serializers.SerializerMethodField()

    class Meta:
        model = models.Bubble
        fields = ('user', 'progress', 'rank', 'check_ins')
        read_only_fields = ['rank', 'check_ins']

    def get_check_ins(self, obj):
        """ Retorna todos os Check-Ins associados à bolha. """
        check_ins = models.CheckIn.objects.filter(bubble=obj)
        return CheckInSerializer(check_ins, many=True).data
