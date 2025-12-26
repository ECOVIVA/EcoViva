from django.contrib.auth.models import AbstractBaseUser

from apps.bubble.domain.entities.bubble import BubbleEntity
from apps.bubble.domain.value_objects.progress import Progress
from apps.bubble.infrastructure.exceptions.bubble import BubbleNotFoundError
from apps.bubble.infrastructure.model import Bubble


class BubbleRepository:
    def _get(self, **filters: object) -> BubbleEntity:
        try:
            bubble = Bubble.objects.get(**filters)
            return self._to_entity(bubble)
        except Bubble.DoesNotExist as e:
            raise BubbleNotFoundError from e

    def _to_entity(self, bubble: Bubble) -> BubbleEntity:
        return BubbleEntity(
            id=bubble.pk,
            user_id=bubble.user.pk,
            rank_id=bubble.rank.pk,
            progress=Progress(bubble.progress),
        )

    def get_bubble_by_user(self, user: AbstractBaseUser) -> BubbleEntity:
        return self._get(user=user)

    def get_bubble_by_pk(self, pk: int) -> BubbleEntity:
        return self._get(pk=pk)

    @staticmethod
    def create_bubble_for_user(user: AbstractBaseUser) -> Bubble:
        bubble = Bubble.objects.create(user=user)
        return bubble
