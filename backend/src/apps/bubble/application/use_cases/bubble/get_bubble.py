from apps.bubble.application.dtos.bubble_profile import BubbleDTO
from apps.bubble.application.mapper.bubble import BubbleMapper
from apps.bubble.application.ports.repositories.bubble import BubbleRepository


class GetBubbleUseCase:
    def __init__(self, repo: BubbleRepository, mapper: BubbleMapper) -> None:
        self.repo = repo
        self.mapper = mapper

    def execute(self, user_id: int) -> BubbleDTO:
        bubble = self.repo.get_by_pk(user_id)
        return self.mapper.to_dto(bubble)
