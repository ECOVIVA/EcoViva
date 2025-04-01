from rest_framework import serializers
from django.utils import timezone
from datetime import timedelta

from . import models

"""
    Este arquivo contém os Serializers responsáveis por converter os dados dos modelos
    em JSON e vice-versa, para que possam ser usados nas APIs.

    Este arquivo é o responsavel por criar os serializers de Bubble e CheckIn, validar seus dados e fazer suas operações
    com o Banco de Dados.

"""
class DifficultySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Difficulty
        fields = '__all__'

class RankSerializer(serializers.ModelSerializer):
    difficulty = DifficultySerializer()
    class Meta:
        model = models.Rank
        fields = '__all__'

class CheckInSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.CheckIn
        fields = '__all__'
        read_only_fields = ['created_at', 'xp_earned']

    def validate(self, data):
        """ Valida se o último Check-In foi feito há menos de 24 horas. """
        bubble = data.get('bubble')  # Obtém a bolha do novo check-in
        ultimo_checkin = models.CheckIn.objects.filter(bubble=bubble).order_by('-created_at').first()

        if ultimo_checkin:
            tempo_desde_ultimo = timezone.now() - ultimo_checkin.created_at
            if tempo_desde_ultimo < timedelta(days=1):
                raise serializers.ValidationError("Um novo Check-in só pode ser feito após 24 horas.")

        return data
    
    def create(self, validated_data):
        """ Atribui XP automaticamente ao criar um check-in. """
        bubble = validated_data.get('bubble')
        # Atribui o XP antes de criar o objeto
        validated_data['xp_earned'] = bubble.rank.difficulty.points_for_activity
        return super().create(validated_data)
    
class BubbleSerializer(serializers.ModelSerializer):
    rank = RankSerializer()
    check_ins = serializers.SerializerMethodField()

    class Meta:
        model = models.Bubble
        fields = 'user', 'progress', 'rank', 'check_ins'
        read_only_fields = ['rank','check_ins']

    def get_check_ins(self, obj):
        """ Retorna todas as respostas de um post """
        check_ins = models.CheckIn.objects.filter(bubble=obj)
        return CheckInSerializer(check_ins, many=True).data