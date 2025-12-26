from typing import TYPE_CHECKING

from django.db import models

if TYPE_CHECKING:
    from django.db.models.manager import Manager

    from apps.bubble.infrastructure.models.checkin import CheckIn


from apps.bubble.infrastructure.models.rank import Rank
from apps.users.models import Users


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
