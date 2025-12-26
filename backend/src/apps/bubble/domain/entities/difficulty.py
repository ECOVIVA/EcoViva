from dataclasses import dataclass

from core.domain.entities.base import Entity


@dataclass
class DifficultyEntity(Entity):
    name: str
    points_for_activity: int
