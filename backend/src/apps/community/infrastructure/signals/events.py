from django.db.models.signals import post_save
from django.dispatch import receiver

from apps.community.infrastructure.models.record import ChallengeRecord


@receiver(post_save, sender=ChallengeRecord)
def award_points_for_challenge_record(
    sender: type[ChallengeRecord],
    instance: ChallengeRecord,
    *created: bool,
    **kwargs: object,
) -> None:
    if not created:
        return

    challenge = instance.competitor_group.challenge
    competitor = instance.competitor_group

    total_points: int = (
        instance.metal_qty * challenge.metal_points
        + instance.paper_qty * challenge.paper_points
        + instance.plastic_qty * challenge.plastic_points
        + instance.glass_qty * challenge.glass_points
    )

    competitor.points += total_points
    competitor.save()
