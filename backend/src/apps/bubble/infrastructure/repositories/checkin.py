from apps.bubble.domain.entities.checkin import CheckInEntity
from apps.bubble.infrastructure.models.checkin import CheckIn
from core.infrastructure.repositories.base import BaseRepository


class CheckInRepository(BaseRepository[CheckInEntity, CheckIn]):
    def _to_entity(self, model: CheckIn) -> CheckInEntity:
        return CheckInEntity(
            id=model.pk,
            bubble_id=model.bubble.pk,
            description=model.description,
            xp_earned=model.xp_earned,
            created_at=model.created_at,
        )

    def save(self, entity: CheckInEntity) -> None:
        return super().save(entity)

    def list_by_bubble_id(self, bubble_id: int) -> list[CheckInEntity]:
        checkins = CheckIn.objects.filter(bubble_id=bubble_id).order_by("-created_at")
        return [self._to_entity(ci) for ci in checkins]

    @staticmethod
    def create_checkin(user_id: int, bubble_id: int) -> None:
        CheckIn.objects.create(user_id=user_id, bubble_id=bubble_id)
