from django.db import models


class Difficulty(models.Model):
    name = models.CharField(max_length=100, unique=True)
    points_for_activity = models.PositiveIntegerField()

    class Meta:
        verbose_name = "Difficulty"
        verbose_name_plural = "Difficulties"

    def __str__(self) -> str:
        return self.name
