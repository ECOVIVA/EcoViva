from rest_framework import serializers  
from apps.study.models.lessons import Lesson, LessonLog

"""
    Este módulo define os serializers para os modelos relacionados às lições e conquistas dos usuários.

    - LessonSerializer        → Serializa os dados das lições.
    - LessonLogSerializer     → Serializa e valida os registros de lições concluídas pelos usuários.
    - AchievementSerializer   → Serializa os dados das conquistas disponíveis no sistema.
    - AchievementLogSerializer→ Serializa as conquistas desbloqueadas pelos usuários.
"""

class LessonSerializer(serializers.ModelSerializer):  
    """
    Serializador para o modelo Lesson, que representa as lições disponíveis.
    Serializa todos os campos do modelo.
    """
    class Meta:  
        model = Lesson  
        fields = '__all__'  


class LessonLogSerializer(serializers.ModelSerializer):  
    """
    Serializador para o modelo LessonLog, que registra as lições concluídas pelo usuário.
    Inclui os campos 'user' (usuário que completou a lição), 'lesson' (lição concluída) e 'completed_at' (data de conclusão).
    O campo 'completed_at' é somente leitura.
    """
    class Meta:  
        model = LessonLog  
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
        if LessonLog.objects.filter(user=user, lesson=lesson).exists():  
            raise serializers.ValidationError("O usuário já concluiu esta lição.")  

        return super().create(validated_data)  
