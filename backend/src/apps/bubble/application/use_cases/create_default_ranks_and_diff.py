from apps.bubble.application.service.difficulty import DifficultyService
from apps.bubble.application.service.rank import RankService
from apps.bubble.infrastructure.repositories.difficulty import DifficultyRepository
from apps.bubble.infrastructure.repositories.rank import RankRepository


class CreateDefaultRanksAndDiff:
    def execute(self) -> None:
        DifficultyService(DifficultyRepository()).create_default_difficulties()
        RankService(RankRepository()).create_default_ranks()
