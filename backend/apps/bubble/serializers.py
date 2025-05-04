from rest_framework import serializers
from django.utils import timezone
from datetime import timedelta

from . import models

"""
    Serializers responsáveis pela conversão dos dados dos models em JSON e vice-versa.

    Este arquivo contém os serializers para os modelos:
    - Difficulty: Serializa os níveis de dificuldade.
    - Rank: Serializa os ranks, incluindo a dificuldade associada.
    - CheckIn: Valida a criação de check-ins e atribui pontos automaticamente.
    - Bubble: Serializa as bolhas, incluindo rank e check-ins associados.
"""

# Serializer para o modelo Difficulty
class DifficultySerializer(serializers.ModelSerializer):
    """
    Serializa o modelo Difficulty.

    - Converte os dados do modelo de dificuldade para JSON.
    - Inclui todos os campos do modelo.
    """
    class Meta:
        model = models.Difficulty
        fields = '__all__'  # Inclui todos os campos do modelo

# Serializer para o modelo Rank
class RankSerializer(serializers.ModelSerializer):
    """
    Serializa o modelo Rank.

    - Inclui os dados da dificuldade associada ao rank.
    - Converte os dados para JSON, garantindo compatibilidade com a API.
    """
    difficulty = DifficultySerializer()  # Serializa a dificuldade dentro do rank
    
    class Meta:
        model = models.Rank
        fields = '__all__'  # Inclui todos os campos do modelo

# Serializer para o modelo CheckIn
class CheckInSerializer(serializers.ModelSerializer):
    """
    Serializa o modelo CheckIn e implementa validações.

    - Impede que um usuário faça mais de um Check-In dentro de 24 horas.
    - Atribui automaticamente a quantidade de pontos ao Check-In.
    """
    
    class Meta:
        model = models.CheckIn
        fields = '__all__'  # Inclui todos os campos do modelo
        read_only_fields = ['created_at', 'xp_earned']  # Impede edição da data e do XP

    def validate(self, data):
        """
        Valida se o último Check-In foi feito há menos de 24 horas.

        - Obtém o último Check-In da bolha associada.
        - Se o último Check-In tiver menos de 24 horas, impede a criação de um novo.
        """
        bubble = data.get('bubble')  
        ultimo_checkin = models.CheckIn.objects.filter(bubble=bubble).order_by('-created_at').first()

        if ultimo_checkin:
            tempo_desde_ultimo = timezone.now() - ultimo_checkin.created_at
            if tempo_desde_ultimo < timedelta(days=1):
                raise serializers.ValidationError("Um novo Check-in só pode ser feito após 24 horas.")

        return data
    
    def create(self, validated_data):
        """
        Atribui automaticamente a quantidade de pontos ao criar um Check-In.

        - Obtém a bolha associada ao Check-In.
        - Define o XP ganho com base na dificuldade do rank da bolha.
        """
        bubble = validated_data.get('bubble')
        validated_data['xp_earned'] = bubble.rank.difficulty.points_for_activity
        return super().create(validated_data)

# Serializer para o modelo Bubble
class BubbleSerializer(serializers.ModelSerializer):
    """
    Serializa o modelo Bubble.

    - Inclui a relação com o modelo Rank.
    - Recupera e exibe os Check-Ins associados à bolha.
    """
    rank = RankSerializer()  # Serializa o rank associado
    check_ins = serializers.SerializerMethodField()  # Campo personalizado para exibir os check-ins da bolha

    class Meta:
        model = models.Bubble
        fields = ('user', 'progress', 'rank', 'check_ins')  # Campos incluídos na serialização
        read_only_fields = ['rank', 'check_ins']  # Define rank e check-ins como somente leitura

    def get_check_ins(self, obj):
        """
        Retorna todos os Check-Ins associados à bolha.

        - Obtém os Check-Ins filtrando pelo ID da bolha.
        - Serializa os Check-Ins e retorna os dados.
        """
        check_ins = obj.checkin_set.all()
        return CheckInSerializer(check_ins, many=True).data  # Serializa múltiplos check-ins
