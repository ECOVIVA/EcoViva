from apps.bubble.application.ports.repositories.difficulty import DifficultyRepository
from apps.bubble.domain.definitions.difficulties import DIFFICULTIES
from apps.bubble.domain.entities.difficulty import DifficultyEntity


class CreateDefaultDifficultiesUseCase:
    def __init__(self, repo: DifficultyRepository) -> None:
        self.repo = repo

    def execute(self) -> None:
        for difficulty in DIFFICULTIES:
            entity = DifficultyEntity(
                name=difficulty.name, points_for_activity=difficulty.points_for_activity
            )

            self.repo.save(entity=entity)
