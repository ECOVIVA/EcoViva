from dataclasses import dataclass

from apps.bubble.domain.entities.rank import RankEntity
from apps.bubble.domain.value_objects.progress import Progress


@dataclass
class BubbleEntity:
    id: int
    user_id: int
    rank: RankEntity
    progress: Progress

    def add_xp(self, points: int) -> "BubbleEntity":
        return BubbleEntity(
            id=self.id,
            user_id=self.user_id,
            rank=self.rank,
            progress=self.progress.increment(points),
        )

    def change_rank(self, new_rank: RankEntity) -> "BubbleEntity":
        return BubbleEntity(
            id=self.id,
            user_id=self.user_id,
            rank=new_rank,
            progress=self.progress,
        )
