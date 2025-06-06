from rest_framework import serializers
from django.utils import timezone
from datetime import timedelta

from apps.bubble.models.bubble import Bubble, Difficulty, Rank
from apps.bubble.serializers.checkin_serializers import CheckInSerializer


class DifficultySerializer(serializers.ModelSerializer):
    """
    Serializa o modelo Difficulty.

    - Converte os dados do modelo de dificuldade para JSON.
    - Inclui todos os campos do modelo.
    """
    class Meta:
        model = Difficulty
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
        model = Rank
        fields = '__all__'  # Inclui todos os campos do modelo

# Serializer para o modelo CheckIn


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
        model = Bubble
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
