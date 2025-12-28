from typing import cast, override

from apps.bubble.domain.entities.checkin import CheckInEntity, NewCheckInEntity
from apps.bubble.infrastructure.models.checkin import CheckIn
from core.infrastructure.repositories.base import BaseRepository, RepositoryWrite


class CheckInRepository(
    BaseRepository[CheckInEntity, CheckIn], RepositoryWrite[CheckInEntity, NewCheckInEntity]
):
    def _to_entity(self, model: CheckIn) -> CheckInEntity:
        return CheckInEntity(
            id=model.pk,
            bubble_id=model.bubble.pk,
            description=model.description,
            xp_earned=model.xp_earned,
            created_at=model.created_at,
        )

    @override
    def create(self, entity: NewCheckInEntity) -> CheckInEntity:
        model = CheckIn.objects.create(
            bubble_id=entity.bubble_id,
            description=entity.description,
            xp_earned=entity.xp_earned,
        )
        return self._to_entity(model)

    def list_by_user_id(self, user_id: int) -> list[CheckInEntity]:
        checkins = CheckIn.objects.filter(bubble__user=user_id).order_by("-created_at")
        return [self._to_entity(ci) for ci in checkins]

    def get_last_check_in(self, bubble_id: int) -> CheckInEntity:
        model = self._list_model(bubble=bubble_id)
        last = cast("CheckIn", model.order_by("-created_at").first())
        return self._to_entity(last)

    def get_xp_earned(self, bubble_id: int) -> int:
        model = self._get_model(bubble=bubble_id)
        return model.bubble.rank.difficulty.points_for_activity
