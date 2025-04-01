from django.db import models
from django.core.exceptions import ValidationError
from django.dispatch import receiver
from apps.users.models import Users

class Category(models.Model):
    class Meta:
        verbose_name = "Category"
        verbose_name_plural = "Categories"

    """Representa uma categoria de lição."""
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

class Lesson(models.Model):
    class Meta:
        verbose_name = "Lesson"
        verbose_name_plural = "Lessions"

    """Representa uma lição disponível para os usuários concluírem."""
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    categories = models.ManyToManyField(Category, blank = True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class LessonCompletion(models.Model):
    class Meta:
        verbose_name = "LessonCompletion"
        verbose_name_plural = "LessionsCompletion"
        unique_together = ('user', 'lesson')  

    user = models.ForeignKey(Users, on_delete=models.CASCADE)
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE)
    completed_at = models.DateTimeField(auto_now_add=True)

    def clean(self):
        """Valida se a lição já foi concluída pelo usuário antes de salvar."""
        if LessonCompletion.objects.filter(user=self.user, lesson=self.lesson).exists():
            raise ValidationError("Você já completou essa lição.")

    def save(self, *args, **kwargs):
        """Executa a validação antes de salvar."""
        self.full_clean()  # Chama `clean()` automaticamente antes de salvar
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.user.username} completed {self.lesson.title}"

@receiver(models.signals.post_save, sender=LessonCompletion)
def check_achievements(sender, instance, created, **kwargs):
    if not created:
        return  # Só verifica conquistas para novas lições concluídas

    user = instance.user

    # Conta o total de lições concluídas pelo usuário
    total_completed = LessonCompletion.objects.filter(user=user).count()

    print(f"✅ {user.username} já completou {total_completed} lições.")  # 🛠 Debug

    # Verifica todas as conquistas disponíveis
    possible_achievements = AchievementRule.objects.filter(category__isnull=True)  # Somente conquistas sem categoria

    for rule in possible_achievements:
        if total_completed >= rule.required_lessons:
            achievement = rule.achievement

            # Se o usuário ainda não desbloqueou essa conquista, adicionamos
            if not UserAchievement.objects.filter(user=user, achievement=achievement).exists():
                UserAchievement.objects.create(user=user, achievement=achievement)
                print(f"🎉 {user.username} desbloqueou a conquista: {achievement.name}!")

class Achievement(models.Model):
    """Conquistas que os usuários podem desbloquear."""
    name = models.CharField(max_length=255)
    description = models.TextField()

    def __str__(self):
        return self.name

class AchievementRule(models.Model):
    """Regras para desbloquear conquistas."""
    achievement = models.ForeignKey(Achievement, on_delete=models.CASCADE)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True) 
    required_lessons = models.PositiveIntegerField(default=0) 

    def __str__(self):
        return f"Regra para {self.achievement.name}: {self.required_lessons} lições de {self.category}"

class UserAchievement(models.Model):
    """Registra conquistas que um usuário já desbloqueou."""
    user = models.ForeignKey(Users, on_delete=models.CASCADE)
    achievement = models.ForeignKey(Achievement, on_delete=models.CASCADE)
    unlocked_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "achievement")

    def __str__(self):
        return f"{self.user.username} desbloqueou {self.achievement.name}"