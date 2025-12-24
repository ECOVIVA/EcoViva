from django.db import models  
from django.dispatch import receiver  
from apps.users.models import Users  

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
