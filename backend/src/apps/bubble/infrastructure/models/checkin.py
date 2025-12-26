from django.db import models
from django.utils import timezone

from apps.bubble.infrastructure.models.bubble import Bubble


class CheckIn(models.Model):
    bubble = models.ForeignKey(Bubble, on_delete=models.CASCADE)
    description = models.CharField(max_length=256, blank=True)
    created_at = models.DateTimeField(default=timezone.now)
    xp_earned = models.PositiveIntegerField(blank=True)

    class Meta:
        verbose_name = "Check-In"
        verbose_name_plural = "Check-Ins"

    def __str__(self) -> str:
        return f"Check-In {self.pk}"
