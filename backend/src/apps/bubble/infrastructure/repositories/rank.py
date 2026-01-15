from apps.bubble.domain.entities.rank import RankEntity
from apps.bubble.infrastructure.mapper.rank import RankDjangoMapper
from apps.bubble.infrastructure.models.rank import Rank


class RankRepository:
    def __init__(self, mapper: RankDjangoMapper) -> None:
        self.mapper = mapper

    def save(self, entity: RankEntity) -> RankEntity:
        model = self.mapper.to_model(entity)
        model.save()
        return self.mapper.to_entity(model)

    def get_by_pk(self, pk: int) -> RankEntity:
        model = Rank.objects.get(pk=pk)
        return self.mapper.to_entity(model)
