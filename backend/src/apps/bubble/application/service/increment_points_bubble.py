from dataclasses import dataclass

from apps.bubble.infrastructure.model import CheckIn
from apps.bubble.infrastructure.repositories.checkin import CheckInRepository


@dataclass
class IncrementPointsBubble:
    check_in: CheckIn

    def execute(self) -> None:
        CheckInRepository.increment_points_for_bubble(self.check_in)
