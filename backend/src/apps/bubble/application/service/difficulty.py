from dataclasses import dataclass

from apps.bubble.domain.definitions.difficulties import DIFFICULTIES
from apps.bubble.infrastructure.repositories.difficulty import DifficultyRepository


@dataclass
class DifficultyService:
    repository: DifficultyRepository

    def create_default_difficulties(self) -> None:
        for difficulty in DIFFICULTIES:
            self.repository.create_difficulty(
                name=difficulty.name, points=difficulty.points_for_activity
            )
