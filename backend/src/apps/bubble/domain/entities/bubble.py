from dataclasses import dataclass

from apps.bubble.domain.exceptions import InvalidBubbleProgressError


@dataclass
class BubbleEntity:
    id: int
    user_id: int
    rank_id: int
    progress: int

    def increment_points_for_bubble(self, points: int) -> None:
        if points < 0:
            raise InvalidBubbleProgressError

        self.progress += points
