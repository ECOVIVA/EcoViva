from apps.bubble.domain.entities.difficulty import DifficultyEntity
from apps.bubble.infrastructure.exceptions.difficulty import DifficultyNotFoundError
from apps.bubble.infrastructure.model import Difficulty


class DifficultyRepository:
    def _get(self, **filters: object) -> DifficultyEntity:
        try:
            diff = Difficulty.objects.get(**filters)
            return self._to_entity(difficulty=diff)
        except Difficulty.DoesNotExist as e:
            raise DifficultyNotFoundError from e

    def _to_entity(self, difficulty: Difficulty) -> DifficultyEntity:
        return DifficultyEntity(
            name=difficulty.name,
            points_for_activity=difficulty.points_for_activity,
        )

    def get_difficulty_by_pk(self, pk: int) -> DifficultyEntity:
        return self._get(pk=pk)

    @staticmethod
    def create_difficulty(name: str, points: int) -> None:
        Difficulty.objects.get_or_create(name=name, points_for_activity=points)
