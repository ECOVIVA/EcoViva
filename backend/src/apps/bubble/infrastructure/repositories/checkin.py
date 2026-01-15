from apps.bubble.application.ports.repositories.checkin import CheckInRepository
from apps.bubble.domain.entities.checkin import CheckInEntity
from apps.bubble.infrastructure.mapper.checkin import CheckInDjangoMapper
from apps.bubble.infrastructure.models.checkin import CheckIn


class CheckInDjangoRepository:
    def __init__(self, mapper: CheckInDjangoMapper) -> None:
        self.mapper = mapper

    def save(self, entity: CheckInEntity) -> CheckInEntity:
        model = self.mapper.to_model(entity)
        model.save()
        return self.mapper.to_entity(model)

    def list_by_bubble_pk(self, bubble_pk: int) -> list[CheckInEntity]:
        checkins = CheckIn.objects.filter(bubble=bubble_pk).order_by("-created_at")
        return [self.mapper.to_entity(ci) for ci in checkins]

    def get_by_bubble_pk(self, bubble_pk: int) -> CheckInEntity:
        model = CheckIn.objects.get(pk=bubble_pk)
        return self.mapper.to_entity(model)

    def get_xp_earned(self, bubble_pk: int) -> int:
        return CheckIn.objects.get(pk=bubble_pk).bubble.rank.difficulty.points_for_activity


class CheckInRepositoryFactory:
    @staticmethod
    def create() -> CheckInRepository:
        mapper = CheckInDjangoMapper()
        return CheckInDjangoRepository(mapper)
