from rest_framework import serializers  
from apps.study.models.achievement import Achievement, AchievementLog

class AchievementSerializer(serializers.ModelSerializer):  
    """
    Serializador para o modelo Achievement, que representa as conquistas disponíveis no sistema.
    Serializa todos os campos, incluindo o ícone da conquista.
    """
    icon = serializers.ImageField(required=False, allow_null=True)

    class Meta:  
        model = Achievement  
        fields = "__all__"  


class AchievementLogSerializer(serializers.ModelSerializer):  
    """
    Serializador para o modelo AchievementLog, que representa as conquistas desbloqueadas por um usuário.
    O campo 'achievement' é serializado usando o AchievementSerializer.
    """
    achievement = AchievementSerializer(read_only=True)

    class Meta:  
        model = AchievementLog  
        fields = ['user', 'achievement', 'date_awarded']  
