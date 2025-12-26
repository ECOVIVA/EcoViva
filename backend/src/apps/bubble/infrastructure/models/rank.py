from django.db import models

from apps.bubble.infrastructure.models.difficulty import Difficulty


class Rank(models.Model):
    name = models.CharField(max_length=100, unique=True)
    difficulty = models.ForeignKey(Difficulty, on_delete=models.CASCADE)
    points = models.PositiveIntegerField()

    class Meta:
        verbose_name = "Rank"
        verbose_name_plural = "Ranks"

    def __str__(self) -> str:
        return f"{self.name} ({self.difficulty.name})"
