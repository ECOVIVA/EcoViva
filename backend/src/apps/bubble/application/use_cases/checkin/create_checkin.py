import datetime

from apps.bubble.application.dtos.check_in import CheckInCreateDTO
from apps.bubble.application.ports.repositories.bubble import BubbleRepository
from apps.bubble.application.use_cases.bubble.add_xp import AddXpUseCase
from apps.bubble.domain.entities.checkin import CheckInEntity
from apps.bubble.infrastructure.repositories.checkin import CheckInRepository


class CreateCheckinUseCase:
    def __init__(
        self, repo: CheckInRepository, add_xp: AddXpUseCase, bubble_repo: BubbleRepository
    ) -> None:
        self.bubble_repo = bubble_repo
        self.add_xp = add_xp
        self.repo = repo

    def execute(self, dto: CheckInCreateDTO) -> CheckInEntity:
        bubble = self.bubble_repo.get_by_pk(dto.bubble_id)

        updated_bubble = self.add_xp.execute(bubble)

        check_in = CheckInEntity(
            id=None,
            bubble=updated_bubble,
            description=dto.description,
            xp_earned=bubble.rank.difficulty.points_for_activity,
            created_at=datetime.datetime.now(),
        )

        return self.repo.save(check_in)
