from apps.bubble.application.dtos.check_in import CheckInDTO
from apps.bubble.domain.entities.bubble import BubbleEntity
from apps.bubble.domain.entities.checkin import CheckInEntity


class CheckInMapper:
    @staticmethod
    def to_dto(entity: CheckInEntity) -> CheckInDTO:
        return CheckInDTO(
            id=entity.id if entity.id is not None else -1,
            bubble_id=entity.bubble.id,
            description=entity.description,
            xp_earned=entity.xp_earned,
            created_at=entity.created_at,
        )

    @staticmethod
    def to_entity(dto: CheckInDTO, bubble: BubbleEntity) -> CheckInEntity:
        return CheckInEntity(
            id=dto.id,
            bubble=bubble,
            description=dto.description,
            xp_earned=dto.xp_earned,
            created_at=dto.created_at,
        )
