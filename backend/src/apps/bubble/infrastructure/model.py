from typing import TYPE_CHECKING

from django.db import models
from django.dispatch import receiver
from django.utils import timezone

if TYPE_CHECKING:
    from django.db.models.manager import Manager

from apps.users.models import Users


class Difficulty(models.Model):
    name = models.CharField(max_length=100, unique=True)
    points_for_activity = models.PositiveIntegerField()

    class Meta:
        verbose_name = "Difficulty"
        verbose_name_plural = "Difficulties"

    def __str__(self) -> str:
        return self.name


class Rank(models.Model):
    name = models.CharField(max_length=100, unique=True)
    difficulty = models.ForeignKey(Difficulty, on_delete=models.CASCADE)
    points = models.PositiveIntegerField()

    class Meta:
        verbose_name = "Rank"
        verbose_name_plural = "Ranks"

    def __str__(self) -> str:
        return f"{self.name} ({self.difficulty.name})"


class Bubble(models.Model):
    user = models.ForeignKey(Users, on_delete=models.CASCADE)
    progress = models.PositiveIntegerField(default=0)
    rank = models.ForeignKey(Rank, on_delete=models.CASCADE)

    check_ins: "Manager[CheckIn]"

    class Meta:
        verbose_name = "Bubble"
        verbose_name_plural = "Bubbles"

    def __str__(self) -> str:
        return f"Bolha de {self.user}"


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


@receiver(models.signals.post_save, sender=Users)
def signal_create_bubble(
    sender: Users, instance: object, *, created: bool, **kwargs: object
) -> None:
    if created:
        Bubble.objects.get_or_create(user=instance)
