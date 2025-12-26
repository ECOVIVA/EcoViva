from dataclasses import dataclass

from apps.bubble.domain.entities.bubble import BubbleEntity
from apps.bubble.domain.entities.difficulty import DifficultyEntity
from apps.bubble.infrastructure.repositories.bubble import BubbleRepository
from apps.bubble.infrastructure.repositories.difficulty import DifficultyRepository
from apps.bubble.infrastructure.repositories.rank import RankRepository


@dataclass
class BubbleService:
    repository: BubbleRepository

    def get_bubble_difficulty(self, bubble: BubbleEntity) -> DifficultyEntity:
        rank = RankRepository().get_rank_by_pk(bubble.rank_id)
        return DifficultyRepository().get_difficulty_by_pk(rank.difficulty_id)

    def increment_points_for_bubble(self, bubble: BubbleEntity, points: int) -> None:
        bubble.add_xp(points)
        self.repository.update_bubble(bubble)
