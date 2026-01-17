from apps.bubble.application.ports.repositories.rank import RankRepository
from apps.bubble.domain.definitions.ranks import RANKS
from apps.bubble.domain.entities.rank import RankEntity


class CreateDefaultRanksUseCase:
    def __init__(self, repo: RankRepository) -> None:
        self.repo = repo

    def execute(self) -> None:
        for rank in RANKS:
            entity = RankEntity(
                id=None, name=rank.name, difficulty_id=rank.difficulty, points=rank.points
            )

            self.repo.save(entity=entity)
