from apps.bubble.domain.definitions.difficulties import DIFFICULTIES
from apps.bubble.domain.definitions.ranks import RANKS
from apps.bubble.infrastructure.repositories.difficulty import DifficultyRepository
from apps.bubble.infrastructure.repositories.rank import RankRepository


class CreateDefaultRanksService:
    @staticmethod
    def execute() -> None:
        for difficulty in DIFFICULTIES:
            DifficultyRepository.create_difficulty(
                name=difficulty.name, points=difficulty.points_for_activity
            )

        for rank in RANKS:
            RankRepository.create_rank(
                name=rank.name, diff_name=rank.difficulty, points=rank.points
            )
