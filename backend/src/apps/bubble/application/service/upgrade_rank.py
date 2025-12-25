from dataclasses import dataclass

from apps.bubble.infrastructure.model import Bubble
from apps.bubble.infrastructure.repositories.rank import RankRepository


@dataclass
class UpgradeRankService:
    bubble: Bubble

    def execute(self) -> None:
        RankRepository.update_rank(self.bubble)
