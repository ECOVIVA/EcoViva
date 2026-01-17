from typing import Protocol

from apps.bubble.domain.entities.difficulty import DifficultyEntity


class DifficultyRepository(Protocol):
    def save(self, entity: DifficultyEntity) -> DifficultyEntity: ...

    def get_by_pk(self, pk: int) -> DifficultyEntity: ...
