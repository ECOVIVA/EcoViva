from dataclasses import dataclass

from apps.bubble.domain.entities.difficulty import DifficultyEntity


@dataclass
class RankEntity:
    id: int | None
    name: str
    difficulty: DifficultyEntity
    points: int
