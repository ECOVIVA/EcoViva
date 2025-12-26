from dataclasses import dataclass

from apps.bubble.domain.definitions.ranks import RANKS
from apps.bubble.infrastructure.repositories.rank import RankRepository


@dataclass
class RankService:
    repository: RankRepository

    def create_default_ranks(self) -> None:
        for rank in RANKS:
            self.repository.create_rank(
                name=rank.name, diff_name=rank.difficulty, points=rank.points
            )
