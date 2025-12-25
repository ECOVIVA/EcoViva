from dataclasses import dataclass

from apps.bubble.infrastructure.repositories.bubble import BubbleRepository
from apps.bubble.infrastructure.repositories.difficulty import DifficultyRepository


@dataclass
class CheckInEntity:
    id: int
    bubble_id: int
    description: str
    xp_earned: int

    def increment_points_for_bubble(self) -> None:
        bubble = BubbleRepository().get_bubble_by_pk(pk=self.bubble_id)
        difficulty = DifficultyRepository().get_difficulty_by_pk(pk=bubble.rank_id)

        if difficulty:
            bubble.progress += difficulty.points_for_activity
            bubble.save()
