from apps.bubble.domain.entities.difficulty import DifficultyEntity
from apps.bubble.infrastructure.models.difficulty import Difficulty
from core.infrastructure.repositories.base import BaseRepository


class DifficultyRepository(BaseRepository[DifficultyEntity, Difficulty]):
    def _to_entity(self, model: Difficulty) -> DifficultyEntity:
        return DifficultyEntity(
            id=model.pk,
            name=model.name,
            points_for_activity=model.points_for_activity,
        )

    def save(self, entity: DifficultyEntity) -> None:
        return super().save(entity)

    def get_difficulty_by_pk(self, pk: int) -> DifficultyEntity:
        return self._get(pk=pk)

    @staticmethod
    def create_difficulty(name: str, points: int) -> None:
        Difficulty.objects.get_or_create(name=name, points_for_activity=points)
