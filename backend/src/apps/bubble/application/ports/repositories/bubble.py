from typing import Protocol

from apps.bubble.domain.entities.bubble import BubbleEntity


class BubbleRepository(Protocol):
    def save(self, entity: BubbleEntity) -> BubbleEntity: ...

    def get_by_pk(self, pk: int) -> BubbleEntity: ...

    def get_by_user_pk(self, user_pk: int) -> BubbleEntity: ...
