from rest_framework import serializers  
from . import models  

"""
    Este módulo define os serializers para os modelos relacionados às lições e conquistas dos usuários.

    - LessonSerializer               → Serializa os dados das lições.
    - LessonCompletionSerializer     → Serializa e valida as lições concluídas pelos usuários.
    - AchievementSerializer          → Serializa os dados das conquistas disponíveis no sistema.
    - UserAchievementSerializer      → Serializa as conquistas desbloqueadas pelos usuários.
"""

class LessonSerializer(serializers.ModelSerializer):  
    """
    Serializador para o modelo Lesson, que representa as lições disponíveis.
    Serializa todos os campos do modelo.
    """
    class Meta:  
        model = models.Lesson  
        fields = '__all__'  


class LessonCompletionSerializer(serializers.ModelSerializer):  
    """
    Serializador para o modelo LessonCompletion, que registra as lições concluídas pelo usuário.
    Inclui os campos 'user' (usuário que completou a lição), 'lesson' (lição concluída) e 'completed_at' (data de conclusão).
    O campo 'completed_at' é somente leitura.
    """
    class Meta:  
        model = models.LessonCompletion  
        fields = ['user', 'lesson', 'completed_at']  
        read_only_fields = ['completed_at']  

    def create(self, validated_data):  
        """
        Método para criar um novo registro de conclusão de lição.
        Verifica se o usuário já completou a lição antes de permitir a criação do registro.
        """
        user = validated_data['user']  
        lesson = validated_data['lesson']  

        # Impede que um usuário registre a mesma lição como concluída mais de uma vez
        if models.LessonCompletion.objects.filter(user=user, lesson=lesson).exists():  
            raise serializers.ValidationError("O Usuario já concluiu essa lição.")  

        return super().create(validated_data)  


class AchievementSerializer(serializers.ModelSerializer):  
    """
    Serializador para o modelo Achievement, que representa as conquistas disponíveis no sistema.
    Serializa todos os campos do modelo.
    """
    class Meta:  
        model = models.Achievement  
        fields = "__all__"  


class UserAchievementSerializer(serializers.ModelSerializer):  
    """
    Serializador para o modelo UserAchievement, que representa as conquistas desbloqueadas por um usuário.
    Inclui os campos 'achievement' (detalhes da conquista) e 'unlocked_at' (data de desbloqueio).
    O campo 'achievement' é serializado usando o AchievementSerializer.
    """
    achievement = AchievementSerializer(read_only=True)  

    class Meta:  
        model = models.UserAchievement  
        fields = ["achievement", "unlocked_at"]  
