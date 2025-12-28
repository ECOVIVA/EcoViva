from dataclasses import dataclass

from apps.bubble.domain.value_objects.progress import Progress
from core.domain.entities.base import Entity


@dataclass
class BubbleEntity(Entity):
    id: int
    user_id: int
    rank_id: int
    progress: Progress

    def add_xp(self, points: int) -> "BubbleEntity":
        return BubbleEntity(
            id=self.id,
            user_id=self.user_id,
            rank_id=self.rank_id,
            progress=self.progress.increment(points),
        )

    def change_rank(self, new_rank_id: int) -> "BubbleEntity":
        return BubbleEntity(
            id=self.id,
            user_id=self.user_id,
            rank_id=new_rank_id,
            progress=self.progress,
        )
