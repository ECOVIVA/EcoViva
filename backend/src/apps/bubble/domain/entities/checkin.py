from dataclasses import dataclass
from datetime import datetime, timedelta

from django.utils import timezone

from apps.bubble.domain.entities.bubble import BubbleEntity
from core.domain.exceptions import BusinessRuleError


@dataclass
class CheckInEntity:
    id: int | None
    bubble: BubbleEntity
    description: str
    xp_earned: int
    created_at: datetime

    def ensure_check_in_after_24_hours(self, last_checkin: "CheckInEntity") -> None:
        if not last_checkin and last_checkin.created_at is None:
            return

        tempo = timezone.now() - last_checkin.created_at

        if tempo < timedelta(days=1):
            msg = "Um novo Check-in só pode ser feito após 24 horas."
            raise BusinessRuleError(msg)
