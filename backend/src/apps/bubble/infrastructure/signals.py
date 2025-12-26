from django.db import models
from django.dispatch import receiver

from apps.bubble.application.use_cases.create_default_ranks_and_diff import (
    CreateDefaultRanksAndDiff,
)
from apps.bubble.application.use_cases.increment_points_bubble import IncrementPointsBubble
from apps.bubble.application.use_cases.upgrade_rank import UpgradeRank
from apps.bubble.infrastructure.models.checkin import CheckIn


@receiver(models.signals.post_migrate)
def signal_create_default_ranks(sender: object, **kwargs: object) -> None:
    CreateDefaultRanksAndDiff().execute()


@receiver(models.signals.pre_save, sender=CheckIn)
def signal_increment_points_for_bubble(
    sender: CheckIn, instance: CheckIn, **kwargs: object
) -> None:
    bubble_pk = instance.bubble.pk
    IncrementPointsBubble().execute(bubble_pk)


@receiver(models.signals.post_save, sender=CheckIn)
def signal_upgrade_rank(sender: CheckIn, instance: CheckIn, **kwargs: object) -> None:
    bubble = instance.bubble

    UpgradeRank().execute(bubble.pk)
