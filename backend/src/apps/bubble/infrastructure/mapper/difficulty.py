from apps.bubble.domain.entities.difficulty import DifficultyEntity
from apps.bubble.infrastructure.models.difficulty import Difficulty


class DifficultyDjangoMapper:
    @staticmethod
    def to_entity(model: Difficulty) -> DifficultyEntity:
        return DifficultyEntity(name=model.name, points_for_activity=model.points_for_activity)

    @staticmethod
    def to_model(entity: DifficultyEntity) -> Difficulty:
        return Difficulty(
            name=entity.name,
            points_for_activity=entity.points_for_activity,
        )
