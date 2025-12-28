from dataclasses import dataclass

from apps.bubble.application.dtos.bubble_profile import BubbleProfileDTO
from apps.bubble.domain.entities.bubble import BubbleEntity
from apps.bubble.infrastructure.repositories.bubble import BubbleRepository
from apps.bubble.infrastructure.repositories.difficulty import DifficultyRepository
from apps.bubble.infrastructure.repositories.rank import RankRepository


@dataclass
class BubbleService:
    def get_bubble(self, user_id: int) -> BubbleProfileDTO:
        bubble = BubbleRepository().get_bubble_by_user(user_id)
        rank = RankRepository().get_rank_by_pk(bubble.rank_id)
        diff = DifficultyRepository().get_difficulty_by_pk(rank.difficulty_id)

        return BubbleProfileDTO(
            user_id=bubble.user_id,
            progress=bubble.progress.value,
            rank_name=rank.name,
            difficulty_name=diff.name,
        )

    def increment_points_for_bubble(self, bubble: BubbleEntity, points: int) -> None:
        bubble.add_xp(points)
        BubbleRepository().update_bubble(bubble)
