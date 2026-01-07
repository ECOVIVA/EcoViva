from django.db import models

from apps.community.infrastructure.models.challenge import Challenge
from apps.users.infrastructure.models.user import Users


class ChallengeCompetitor(models.Model):
    class Meta:
        verbose_name = "Gincana Competitor"
        verbose_name_plural = "Gincana Competitors"
        unique_together = ("challenge", "name")

    challenge = models.ForeignKey(
        Challenge,
        on_delete=models.CASCADE,
        related_name="competitor_groups",
        verbose_name="Gincana",
    )
    user = models.ForeignKey(
        Users,
        on_delete=models.CASCADE,
        related_name="competitor_groups",
        verbose_name="User",
    )

    points = models.PositiveIntegerField(blank=True, default=0)

    def __str__(self) -> str:
        return f"{self.user.username} - {self.challenge.title}"
