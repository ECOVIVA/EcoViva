from django.db import models  
from django.core.exceptions import ValidationError  
from django.dispatch import receiver  
from apps.users.models import Users  

"""
    Este módulo define os modelos relacionados às lições e conquistas dos usuários.

    - Category             → Representa uma categoria de lição.
    - Lesson               → Representa uma lição disponível para os usuários.
    - LessonCompletion     → Registra as lições concluídas pelos usuários.
    - Achievement          → Representa as conquistas que os usuários podem desbloquear.
    - AchievementRule      → Define regras para desbloquear conquistas.
    - UserAchievement      → Registra as conquistas desbloqueadas pelos usuários.
"""

class Category(models.Model):  
    """
    Modelo que representa uma categoria de lição.
    As categorias podem ser associadas a várias lições.
    """
    class Meta:  
        verbose_name = "Category"  
        verbose_name_plural = "Categories"  

    name = models.CharField(max_length=100, unique=True)  # Nome único da categoria  

    def __str__(self):  
        return self.name  

class Lesson(models.Model):  
    """
    Modelo que representa uma lição disponível para os usuários concluírem.
    As lições podem pertencer a várias categorias.
    """
    class Meta:  
        verbose_name = "Lesson"  
        verbose_name_plural = "Lessons"  

    title = models.CharField(max_length=255)  # Título da lição  
    description = models.TextField(blank=True)  # Descrição opcional da lição  
    categories = models.ManyToManyField(Category, blank=True)  # Relacionamento com categorias  
    created_at = models.DateTimeField(auto_now_add=True)  # Data de criação da lição  

    def __str__(self):  
        return self.title  

class LessonLog(models.Model):  
    """
    Modelo que registra as lições concluídas pelos usuários.
    Um usuário só pode registrar uma conclusão por lição.
    """
    class Meta:  
        verbose_name = "LessonLog"  
        verbose_name_plural = "LessonsLog"  
        unique_together = ('user', 'lesson')  # Garante que um usuário não conclua a mesma lição mais de uma vez  

    user = models.ForeignKey(Users, on_delete=models.CASCADE)  # Usuário que concluiu a lição  
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE)  # Lição concluída  
    completed_at = models.DateTimeField(auto_now_add=True)  # Data da conclusão  

    def save(self, *args, **kwargs):  
        """
        Executa a validação antes de salvar para evitar registros duplicados.
        """
        self.full_clean()  # Chama `clean()` automaticamente antes de salvar  
        super().save(*args, **kwargs)  

    def __str__(self):  
        return f"{self.user.username} completed {self.lesson.title}"  

class Achievement(models.Model):
    class CategoryChoices(models.TextChoices):
        CHECKIN = 'checkin', 'Check-in'
        LESSON = 'lesson', 'Lição'

    class Meta:
        verbose_name = 'Achievement'
        verbose_name_plural = "Achievements"

    name = models.CharField(max_length=100, unique=True)
    icon = models.ImageField(upload_to='achievements/', null=True, blank=True)
    category = models.CharField(max_length=50, choices=CategoryChoices.choices)
    condition = models.SlugField(max_length=100, unique=True)
    description = models.TextField()

    def __str__(self):
        return f"Conquista: {self.name}"

class AchievementLog(models.Model):
    class Meta:
        verbose_name = 'Achievement Log'
        verbose_name_plural = "Achievement Logs"
        
    user = models.ForeignKey(Users, on_delete=models.CASCADE)
    achievement = models.ForeignKey(Achievement, on_delete=models.CASCADE)
    date_awarded = models.DateField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'achievement')

    def __str__(self):
        return f"Conquista de {self.user.username}" 