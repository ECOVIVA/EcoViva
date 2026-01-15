from apps.bubble.domain.entities.checkin import CheckInEntity
from apps.bubble.infrastructure.models.checkin import CheckIn


class CheckInDjangoMapper:
    @staticmethod
    def to_entity(model: CheckIn) -> CheckInEntity:
        return CheckInEntity(
            id=model.pk,
            bubble_id=model.bubble.pk,
            created_at=model.created_at,
            description=model.description,
            xp_earned=model.xp_earned,
        )

    @staticmethod
    def to_model(entity: CheckInEntity) -> CheckIn:
        return CheckIn(
            id=entity.id,
            bubble=entity.bubble_id,
            description=entity.description,
            xp_earned=entity.xp_earned,
            created_at=entity.created_at,
        )
