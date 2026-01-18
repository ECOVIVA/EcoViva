from apps.bubble.application.ports.repositories.bubble import BubbleRepository
from apps.bubble.application.ports.repositories.rank import RankRepository
from apps.bubble.domain.entities.bubble import BubbleEntity


class AddXpUseCase:
    def __init__(self, repo: BubbleRepository, rank_repo: RankRepository) -> None:
        self.repo = repo
        self.rank_repo = rank_repo

    def execute(self, bubble: BubbleEntity) -> BubbleEntity:
        updated_bubble = bubble.add_xp(bubble.rank.points)
        value = updated_bubble.progress.value

        if value > bubble.rank.points:
            next_rank = self.rank_repo.get_next_rank(value)
            updated_bubble = updated_bubble.change_rank(new_rank=next_rank)

        return self.repo.save(updated_bubble)
