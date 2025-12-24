from django.db import models  
from django.dispatch import receiver  
from apps.users.models import Users  

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