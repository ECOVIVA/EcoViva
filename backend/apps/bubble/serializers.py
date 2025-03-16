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

class BubbleSerializer(serializers.ModelSerializer):
    class Meta:

        # Classe responsavel por definir qual model o serializer vai realizar as operações, e quais campos
        # serão usados por ele.
        
        model = models.Bubble
        fields = '__all__'
        read_only_fields = ['rank']

class CheckInSerializer(serializers.ModelSerializer):
    class Meta:

        # Classe responsavel por definir qual model o serializer vai realizar as operações, e quais campos
        # serão usados por ele.
        
        model = models.CheckIn
        fields = '__all__'
        read_only_fields = ['created_at']

    def validate(self, data):
        """ Valida se o último Check-In foi feito há menos de 24 horas. """
        bubble = data.get('bubble')  # Obtém a bolha do novo check-in
        ultimo_checkin = models.CheckIn.objects.filter(bubble=bubble).order_by('-created_at').first()
        print('Check-In', ultimo_checkin)

        if ultimo_checkin:
            tempo_desde_ultimo = timezone.now() - ultimo_checkin.created_at
            if tempo_desde_ultimo < timedelta(days=1):
                raise serializers.ValidationError("Um novo Check-in só pode ser feito após 24 horas.")

        return data