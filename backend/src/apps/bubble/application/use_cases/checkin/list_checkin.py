from apps.bubble.application.dtos.check_in import CheckInDTO
from apps.bubble.application.mapper.checkin import CheckInMapper
from apps.bubble.application.ports.repositories.checkin import CheckInRepository


class ListCheckInUseCase:
    def __init__(self, repo: CheckInRepository, mapper: CheckInMapper) -> None:
        self.repo = repo
        self.mapper = mapper

    def execute(self, bubble_id: int) -> list[CheckInDTO]:
        checkins = self.repo.list_by_bubble_pk(bubble_id)
        return [self.mapper.to_dto(checkin) for checkin in checkins]
