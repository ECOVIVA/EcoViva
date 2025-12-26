from dataclasses import dataclass

from apps.bubble.domain.exceptions import InvalidBubbleProgressError


@dataclass(frozen=True)
class Progress:
    value: int

    def __post_init__(self) -> None:
        if self.value < 0:
            raise InvalidBubbleProgressError

    def increment(self, points: int) -> "Progress":
        if points < 0:
            raise InvalidBubbleProgressError

        return Progress(self.value + points)
