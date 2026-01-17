from apps.bubble.domain.entities.rank import RankEntity
from apps.bubble.infrastructure.mapper.rank import RankDjangoMapper
from apps.bubble.infrastructure.models.rank import Rank


class RankDjangoRepository:
    def __init__(self, mapper: RankDjangoMapper) -> None:
        self.mapper = mapper

    def save(self, entity: RankEntity) -> RankEntity:
        model = self.mapper.to_model(entity)
        model.save()
        return self.mapper.to_entity(model)

    def list_all(self) -> list[RankEntity]:
        models = Rank.objects.all()
        return [self.mapper.to_entity(model) for model in models]

    def get_next_rank(self, current_points: int) -> RankEntity:
        model = (
            Rank.objects.filter(required_points__gt=current_points)
            .order_by("required_points")
            .first()
        )

        if model is None:
            raise Rank.DoesNotExist

        return self.mapper.to_entity(model)

    def get_by_pk(self, pk: int) -> RankEntity:
        model = Rank.objects.get(pk=pk)
        return self.mapper.to_entity(model)
