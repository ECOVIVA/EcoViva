from apps.bubble.infrastructure.repositories.bubble import BubbleRepository
from apps.bubble.infrastructure.repositories.rank import RankRepository


class UpgradeRank:
    def execute(self, bubble_id: int) -> None:
        bubble = BubbleRepository().get_bubble_by_pk(bubble_id)
        next_rank = RankRepository().get_next_rank(bubble.progress.value)

        if not next_rank:
            return

        if bubble.rank_id == next_rank.id:
            return

        bubble = bubble.change_rank(next_rank.id)

        BubbleRepository().save(bubble)
