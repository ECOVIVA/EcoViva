from apps.bubble.application.dtos.check_in import CheckInCreateDTO, CheckInDTO
from apps.bubble.application.mapper.checkin import CheckInMapper
from apps.bubble.application.use_cases.bubble.add_xp import AddXpUseCase
from apps.bubble.application.use_cases.checkin.create_checkin import CreateCheckinUseCase
from apps.bubble.application.use_cases.checkin.list_checkin import ListCheckInUseCase
from apps.bubble.domain.entities.checkin import CheckInEntity
from apps.bubble.infrastructure.repositories.bubble import BubbleRepositoryFactory
from apps.bubble.infrastructure.repositories.checkin import CheckInRepositoryFactory
from apps.bubble.infrastructure.repositories.rank import RankRepositoryFactory


class CheckInService:
    def __init__(self, create_class: CreateCheckinUseCase, list_class: ListCheckInUseCase) -> None:
        self.create_class = create_class
        self.list_class = list_class

    def create(self, dto: CheckInCreateDTO) -> CheckInEntity:
        return self.create_class.execute(dto)

    def list(self, bubble_pk: int) -> list[CheckInDTO]:
        return self.list_class.execute(bubble_pk)


class CheckInServiceFactory:
    @staticmethod
    def create() -> CheckInService:
        repo = CheckInRepositoryFactory.create()
        bubble_repo = BubbleRepositoryFactory.create()
        mapper = CheckInMapper()

        rank_repo = RankRepositoryFactory.create()

        increment_class = AddXpUseCase(bubble_repo, rank_repo)

        create_class = CreateCheckinUseCase(repo, increment_class, bubble_repo)
        list_class = ListCheckInUseCase(repo, mapper)

        return CheckInService(create_class=create_class, list_class=list_class)
