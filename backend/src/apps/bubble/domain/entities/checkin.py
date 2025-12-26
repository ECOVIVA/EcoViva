from dataclasses import dataclass

from core.domain.entities.base import Entity


@dataclass
class CheckInEntity(Entity):
    bubble_id: int
    description: str
    xp_earned: int
