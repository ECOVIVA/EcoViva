from apps.bubble.application.dtos.bubble_profile import BubbleDTO
from apps.bubble.application.mapper.bubble import BubbleMapper
from apps.bubble.application.ports.repositories.bubble import BubbleRepository
from apps.bubble.domain.entities.bubble import BubbleEntity


class IncrementPointsBubbleUseCase:
    def __init__(self, repo: BubbleRepository, mapper: BubbleMapper) -> None:
        self.repo = repo
        self.mapper = mapper

    def execute(self, bubble: BubbleEntity, points: int) -> BubbleDTO:
        bubble.add_xp(points)
        self.repo.save(bubble)
        return self.mapper.to_dto(bubble)
