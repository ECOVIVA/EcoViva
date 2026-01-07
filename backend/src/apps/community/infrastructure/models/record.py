from django.db import models
from django.utils import timezone

from apps.users.infrastructure.models.user import Users


class ChallengeRecord(models.Model):
    user = models.ForeignKey(Users, on_delete=models.CASCADE, related_name="collection_records")
    metal_qty = models.PositiveIntegerField(default=0)
    paper_qty = models.PositiveIntegerField(default=0)
    plastic_qty = models.PositiveIntegerField(default=0)
    glass_qty = models.PositiveIntegerField(default=0)

    collected_at = models.DateTimeField(default=timezone.now)

    class Meta:
        verbose_name = "Challenge Record"
        verbose_name_plural = "Challenge Records"
        ordering = ("-collected_at",)

    def __str__(self) -> str:
        return f"Coleta de {self.user.username} em {self.collected_at.strftime('%Y-%m-%d')}"
