from apps.bubble.application.dtos.bubble_profile import BubbleDTO
from apps.bubble.application.mapper.bubble import BubbleMapper
from apps.bubble.application.use_cases.bubble.get_bubble import GetBubbleUseCase
from apps.bubble.application.use_cases.bubble.increment_points_bubble import (
    IncrementPointsBubbleUseCase,
)
from apps.bubble.domain.entities.bubble import BubbleEntity
from apps.bubble.infrastructure.repositories.bubble import (
    BubbleRepositoryFactory,
)


class BubbleService:
    def __init__(
        self, get_class: GetBubbleUseCase, increment_class: IncrementPointsBubbleUseCase
    ) -> None:
        self.get_class = get_class
        self.increment_class = increment_class

    def get_bubble(self, user_id: int) -> BubbleDTO:
        return self.get_class.execute(user_id)

    def increment_points_for_bubble(self, bubble: BubbleEntity, points: int) -> BubbleDTO:
        return self.increment_class.execute(bubble, points)


class BubbleServiceFactory:
    @staticmethod
    def create() -> BubbleService:
        repo = BubbleRepositoryFactory.create()
        mapper = BubbleMapper()

        get_class = GetBubbleUseCase(repo, mapper)
        increment_class = IncrementPointsBubbleUseCase(repo, mapper)

        return BubbleService(get_class, increment_class)
