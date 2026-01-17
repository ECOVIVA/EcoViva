from apps.bubble.infrastructure.repositories.bubble import BubbleRepository


class UpgradeRankUseCase:
    def __init__(self, repo: BubbleRepository) -> None:
        self.repo = repo

    def execute(self, bubble_id: int) -> None:
        bubble = self.repo.get_by_pk(bubble_id)

        ...

        self.repo.save(bubble)
