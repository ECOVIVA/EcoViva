from apps.bubble.domain.entities.difficulty import DifficultyEntity
from apps.bubble.infrastructure.mapper.difficulty import DifficultyDjangoMapper
from apps.bubble.infrastructure.models.difficulty import Difficulty


class DifficultyDjangoRepository:
    def __init__(self, mapper: DifficultyDjangoMapper) -> None:
        self.mapper = mapper

    def save(self, entity: DifficultyEntity) -> DifficultyEntity:
        model = self.mapper.to_model(entity)
        model.save()
        return self.mapper.to_entity(model)

    def get_by_pk(self, pk: int) -> DifficultyEntity:
        diff = Difficulty.objects.get(pk=pk)
        return self.mapper.to_entity(diff)
