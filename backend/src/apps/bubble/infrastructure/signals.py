from django.db import models
from django.dispatch import receiver

from apps.bubble.application.service.create_default_ranks import CreateDefaultRanksService

from .model import CheckIn, Rank


@receiver(models.signals.post_migrate)
def signal_create_default_ranks(sender: object, **kwargs: object) -> None:
    CreateDefaultRanksService.execute()


@receiver(models.signals.pre_save, sender=CheckIn)
def signal_increment_points_for_bubble(
    sender: CheckIn, instance: CheckIn, **kwargs: object
) -> None:
    bubble = instance.bubble
    difficulty = bubble.rank.difficulty

    if difficulty:
        bubble.progress += difficulty.points_for_activity
        bubble.save()


@receiver(models.signals.post_save, sender=CheckIn)
def signal_upgrade_rank(sender: CheckIn, instance: CheckIn, **kwargs: object) -> None:
    bubble = instance.bubble

    next_rank = Rank.objects.filter(points__lte=bubble.progress).order_by("-points").first()
    if next_rank and next_rank != bubble.rank:
        bubble.rank = next_rank
        bubble.progress = 0
        bubble.save()
