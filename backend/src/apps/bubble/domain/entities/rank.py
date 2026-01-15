from dataclasses import dataclass

from core.domain.entities.base import Entity


@dataclass
class RankEntity(Entity):
    id: int | None
    name: str
    difficulty_id: int
    points: int
