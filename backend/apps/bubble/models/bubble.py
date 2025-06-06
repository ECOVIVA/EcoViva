from django.db import models
from django.utils import timezone
from django.dispatch import receiver
from apps.users.models import Users

class Difficulty(models.Model):
    """
    Define os níveis de dificuldade das atividades, determinando quantos pontos cada uma vale.
    """
    name = models.CharField(max_length=100, unique=True)  # Nome da dificuldade (ex.: Fácil, Médio, Difícil)
    points_for_activity = models.PositiveIntegerField()  # Pontos atribuídos por atividade nesta dificuldade

    class Meta:
        verbose_name = 'Difficulty'
        verbose_name_plural = 'Difficulties'

    def __str__(self):
        return self.name


class Rank(models.Model):
    """
    Representa um rank dentro de uma bolha, associado a um nível de dificuldade e uma pontuação mínima necessária.
    """
    name = models.CharField(max_length=100, unique=True)  # Nome do rank (ex.: Protetor do Planeta)
    difficulty = models.ForeignKey(Difficulty, on_delete=models.SET_DEFAULT, default=1)  # Nível de dificuldade do rank
    points = models.PositiveIntegerField()  # Pontuação necessária para alcançar este rank

    class Meta:
        verbose_name = 'Rank'
        verbose_name_plural = 'Ranks'

    def __str__(self):
        return f"{self.name} ({self.difficulty.name})"


class Bubble(models.Model):
    """
    Representa uma bolha associada a um usuário, registrando seu progresso e rank atual.
    """
    user = models.ForeignKey(Users, on_delete=models.CASCADE)  # Usuário proprietário da bolha
    progress = models.PositiveIntegerField(default=0)  # Pontuação acumulada dentro da bolha
    rank = models.ForeignKey(Rank, on_delete=models.SET_DEFAULT, default=1)  # Rank atual do usuário na bolha

    class Meta:
        verbose_name = "Bubble"
        verbose_name_plural = "Bubbles"

    def __str__(self):
        return f"Bolha de {self.user}"
    
@receiver(models.signals.post_save, sender=Users)
def create_bubble(sender, instance, created, **kwargs):
    if created:
        Bubble.objects.get_or_create(user=instance)