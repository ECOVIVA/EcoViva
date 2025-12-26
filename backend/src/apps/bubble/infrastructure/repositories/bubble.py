from typing import override

from django.contrib.auth.models import AbstractBaseUser

from apps.bubble.domain.entities.bubble import BubbleEntity
from apps.bubble.domain.value_objects.progress import Progress
from apps.bubble.infrastructure.models.bubble import Bubble
from core.infrastructure.repositories.base import BaseRepository


class BubbleRepository(BaseRepository[BubbleEntity, Bubble]):
    @override
    def _to_entity(self, model: Bubble) -> BubbleEntity:
        return BubbleEntity(
            id=model.pk,
            user_id=model.user.pk,
            rank_id=model.rank.pk,
            progress=Progress(model.progress),
        )

    def save(self, entity: BubbleEntity) -> None:
        return super().save(entity)

    def get_bubble_by_user(self, user: AbstractBaseUser) -> BubbleEntity:
        return self._get(user=user)

    def get_bubble_by_pk(self, pk: int) -> BubbleEntity:
        return self._get(pk=pk)

    def update_bubble(self, bubble: BubbleEntity) -> None:
        bubble_model = self._get_model(pk=bubble.id)
        bubble_model.objects.update(progress=bubble.progress.value)

    def create_bubble_for_user(self, user: AbstractBaseUser) -> Bubble:
        return Bubble.objects.create(user=user)
