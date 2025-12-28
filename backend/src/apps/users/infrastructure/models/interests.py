from django.db import models


class Interests(models.Model):
    class Meta:
        verbose_name = "Interest"
        verbose_name_plural = "Interests"

    name = models.CharField(max_length=255, unique=True)

    def __str__(self) -> str:
        return f"Interesse por {self.name}"
