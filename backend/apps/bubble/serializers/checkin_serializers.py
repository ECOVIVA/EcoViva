from rest_framework import serializers
from django.utils import timezone
from datetime import timedelta
from apps.bubble.models.checkin import CheckIn

class CheckInSerializer(serializers.ModelSerializer):
    """
    Serializa o modelo CheckIn e implementa validações.

    - Impede que um usuário faça mais de um Check-In dentro de 24 horas.
    - Atribui automaticamente a quantidade de pontos ao Check-In.
    """
    
    class Meta:
        model = CheckIn
        fields = '__all__'  # Inclui todos os campos do modelo
        read_only_fields = ['created_at', 'xp_earned']  # Impede edição da data e do XP

    def validate(self, data):
        """
        Valida se o último Check-In foi feito há menos de 24 horas.

        - Obtém o último Check-In da bolha associada.
        - Se o último Check-In tiver menos de 24 horas, impede a criação de um novo.
        """
        bubble = data.get('bubble')  
        ultimo_checkin = CheckIn.objects.filter(bubble=bubble).order_by('-created_at').first()

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