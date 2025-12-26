from apps.bubble.application.service.bubble import BubbleService
from apps.bubble.infrastructure.repositories.bubble import BubbleRepository


class IncrementPointsBubble:
    def __init__(self) -> None:
        self.bubble_service = BubbleService(repository=BubbleRepository())

    def execute(self, bubble_pk: int) -> None:
        bubble = BubbleRepository().get_bubble_by_pk(bubble_pk)
        difficulty = self.bubble_service.get_bubble_difficulty(bubble)
        if difficulty:
            points = difficulty.points_for_activity
            self.bubble_service.increment_points_for_bubble(bubble, points)
