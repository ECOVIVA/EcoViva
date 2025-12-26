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
        )

    def save(self, entity: CheckInEntity) -> None:
        return super().save(entity)

    @staticmethod
    def create_checkin(user_id: int, bubble_id: int) -> None:
        CheckIn.objects.create(user_id=user_id, bubble_id=bubble_id)
