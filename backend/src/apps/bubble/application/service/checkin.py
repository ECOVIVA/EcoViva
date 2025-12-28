from apps.bubble.application.dtos.bubble_profile import CheckProfileInDTO
from apps.bubble.domain.entities.checkin import CheckInEntity, NewCheckInEntity
from apps.bubble.infrastructure.repositories.checkin import CheckInRepository


class CheckInService:
    def create(self, bubble_id: int, description: str) -> CheckInEntity:
        xp_earned = CheckInRepository().get_xp_earned(bubble_id)
        check_in = NewCheckInEntity(
            bubble_id=bubble_id, description=description, xp_earned=xp_earned
        )

        return CheckInRepository().create(check_in)

    def list_check_ins_by_user(self, user_id: int) -> list[CheckProfileInDTO]:
        check_ins = CheckInRepository().list_by_user_id(user_id)
        return [
            CheckProfileInDTO(
                bubble_id=ci.bubble_id,
                description=ci.description,
                xp_earned=ci.xp_earned,
                created_at=ci.created_at,
            )
            for ci in check_ins
        ]
