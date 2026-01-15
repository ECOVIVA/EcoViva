from apps.bubble.domain.entities.rank import RankEntity
from apps.bubble.infrastructure.models.rank import Rank


class RankDjangoMapper:
    @staticmethod
    def to_entity(model: Rank) -> RankEntity:
        return RankEntity(
            id=model.pk,
            name=model.name,
            difficulty_id=model.difficulty.pk,
            points=model.points,
        )

    @staticmethod
    def to_model(entity: RankEntity) -> Rank:
        return Rank(
            id=entity.id,
            name=entity.name,
            difficulty=entity.difficulty_id,
            points=entity.points,
        )
