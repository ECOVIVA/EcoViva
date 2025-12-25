from django.db import models
from django.dispatch import receiver

from apps.bubble.application.service.create_default_ranks import CreateDefaultRanksService
from apps.bubble.application.service.increment_points_bubble import IncrementPointsBubble
from apps.bubble.application.service.upgrade_rank import UpgradeRankService

from .model import CheckIn


@receiver(models.signals.post_migrate)
def signal_create_default_ranks(sender: object, **kwargs: object) -> None:
    CreateDefaultRanksService.execute()


@receiver(models.signals.pre_save, sender=CheckIn)
def signal_increment_points_for_bubble(
    sender: CheckIn, instance: CheckIn, **kwargs: object
) -> None:
    IncrementPointsBubble(check_in=instance).execute()


@receiver(models.signals.post_save, sender=CheckIn)
def signal_upgrade_rank(sender: CheckIn, instance: CheckIn, **kwargs: object) -> None:
    bubble = instance.bubble

    UpgradeRankService(bubble=bubble).execute()
