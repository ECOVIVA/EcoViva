from apps.bubble.application.dtos.bubble_profile import BubbleDTO
from apps.bubble.application.mapper.bubble import BubbleMapper
from apps.bubble.application.use_cases.bubble.get_bubble import GetBubbleUseCase
from apps.bubble.infrastructure.repositories.bubble import (
    BubbleRepositoryFactory,
)


class BubbleService:
    def __init__(self, get_class: GetBubbleUseCase) -> None:
        self.get_class = get_class

    def get_bubble(self, user_id: int) -> BubbleDTO:
        return self.get_class.execute(user_id)


class BubbleServiceFactory:
    @staticmethod
    def create() -> BubbleService:
        repo = BubbleRepositoryFactory.create()
        mapper = BubbleMapper()

        get_class = GetBubbleUseCase(repo, mapper)

        return BubbleService(get_class)
