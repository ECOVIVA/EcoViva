from dataclasses import dataclass
from datetime import datetime, timedelta

from django.utils import timezone

from core.domain.entities.base import Entity
from core.domain.exceptions import BusinessRuleError


@dataclass
class CheckInEntity(Entity):
    id: int
    bubble_id: int
    description: str
    xp_earned: int
    created_at: datetime

    def ensure_check_in_after_24_hours(self, last_checkin: "CheckInEntity") -> None:
        if not last_checkin:
            return

        tempo = timezone.now() - last_checkin.created_at

        if tempo < timedelta(days=1):
            msg = "Um novo Check-in só pode ser feito após 24 horas."
            raise BusinessRuleError(msg)


@dataclass
class NewCheckInEntity(Entity):
    bubble_id: int
    description: str
    xp_earned: int
