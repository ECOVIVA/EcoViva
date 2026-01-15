import datetime

from apps.bubble.application.dtos.check_in import CheckInCreateDTO
from apps.bubble.domain.entities.checkin import CheckInEntity
from apps.bubble.infrastructure.repositories.checkin import CheckInRepository


class CreateCheckinUseCase:
    def __init__(self, repo: CheckInRepository) -> None:
        self.repo = repo

    def execute(self, dto: CheckInCreateDTO) -> CheckInEntity:
        xp_earned = self.repo.get_xp_earned(dto.bubble_id)

        check_in = CheckInEntity(
            id=None,
            bubble_id=dto.bubble_id,
            description=dto.description,
            xp_earned=xp_earned,
            created_at=datetime.datetime.now(),
        )

        return self.repo.save(check_in)
