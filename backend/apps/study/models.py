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


class LessonCompletion(models.Model):  
    """
    Modelo que registra as lições concluídas pelos usuários.
    Um usuário só pode registrar uma conclusão por lição.
    """
    class Meta:  
        verbose_name = "LessonCompletion"  
        verbose_name_plural = "LessonsCompletion"  
        unique_together = ('user', 'lesson')  # Garante que um usuário não conclua a mesma lição mais de uma vez  

    user = models.ForeignKey(Users, on_delete=models.CASCADE)  # Usuário que concluiu a lição  
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE)  # Lição concluída  
    completed_at = models.DateTimeField(auto_now_add=True)  # Data da conclusão  

    def clean(self):  
        """
        Valida se a lição já foi concluída pelo usuário antes de salvar.
        Impede a duplicação de registros de conclusão.
        """
        if LessonCompletion.objects.filter(user=self.user, lesson=self.lesson).exists():  
            raise ValidationError("Você já completou essa lição.")  

    def save(self, *args, **kwargs):  
        """
        Executa a validação antes de salvar para evitar registros duplicados.
        """
        self.full_clean()  # Chama `clean()` automaticamente antes de salvar  
        super().save(*args, **kwargs)  

    def __str__(self):  
        return f"{self.user.username} completed {self.lesson.title}"  


@receiver(models.signals.post_save, sender=LessonCompletion)  
def check_achievements(sender, instance, created, **kwargs):  
    """
    Sinal que verifica e concede conquistas aos usuários quando uma nova lição é concluída.
    Se a lição não foi recém-criada, o processo é interrompido.
    """
    if not created:  
        return  

    user = instance.user  

    # Conta o total de lições concluídas pelo usuário  
    total_completed = LessonCompletion.objects.filter(user=user).count()  

    print(f"✅ {user.username} já completou {total_completed} lições.")  # 🛠 Debug  

    # Obtém todas as conquistas que não possuem uma categoria específica  
    possible_achievements = AchievementRule.objects.filter(category__isnull=True)  

    # Verifica se o usuário atende aos requisitos de alguma conquista  
    for rule in possible_achievements:  
        if total_completed >= rule.required_lessons:  
            achievement = rule.achievement  

            # Concede a conquista se o usuário ainda não a desbloqueou  
            if not UserAchievement.objects.filter(user=user, achievement=achievement).exists():  
                UserAchievement.objects.create(user=user, achievement=achievement)  
                print(f"🎉 {user.username} desbloqueou a conquista: {achievement.name}!")  


class Achievement(models.Model):  
    """
    Modelo que representa as conquistas disponíveis no sistema.
    Os usuários podem desbloqueá-las ao completar certas condições.
    """
    name = models.CharField(max_length=255)  # Nome da conquista  
    description = models.TextField()  # Descrição da conquista  

    def __str__(self):  
        return self.name  


class AchievementRule(models.Model):  
    """
    Modelo que define as regras para desbloquear conquistas.
    As conquistas podem estar associadas a uma categoria específica ou serem gerais.
    """
    achievement = models.ForeignKey(Achievement, on_delete=models.CASCADE)  # Conquista associada  
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True)  # Categoria opcional  
    required_lessons = models.PositiveIntegerField(default=0)  # Número mínimo de lições concluídas para desbloqueio  

    def __str__(self):  
        return f"Regra para {self.achievement.name}: {self.required_lessons} lições de {self.category}"  


class UserAchievement(models.Model):  
    """
    Modelo que registra as conquistas desbloqueadas pelos usuários.
    Um usuário pode desbloquear cada conquista apenas uma vez.
    """
    user = models.ForeignKey(Users, on_delete=models.CASCADE)  # Usuário que desbloqueou a conquista  
    achievement = models.ForeignKey(Achievement, on_delete=models.CASCADE)  # Conquista desbloqueada  
    unlocked_at = models.DateTimeField(auto_now_add=True)  # Data do desbloqueio  

    class Meta:  
        unique_together = ("user", "achievement")  # Garante que cada conquista seja única por usuário  

    def __str__(self):  
        return f"{self.user.username} desbloqueou {self.achievement.name}"  
