from apps.bubble.application.ports.repositories.bubble import BubbleRepository
from apps.bubble.domain.entities.bubble import BubbleEntity
from apps.bubble.infrastructure.mapper.bubble import BubbleDjangoMapper
from apps.bubble.infrastructure.models.bubble import Bubble


class BubbleDjangoRepository:
    def __init__(self, mapper: BubbleDjangoMapper) -> None:
        self.mapper = mapper

    def save(self, entity: BubbleEntity) -> BubbleEntity:
        model = self.mapper.to_model(entity)
        model.save()
        return self.mapper.to_entity(model)

    def get_by_pk(self, pk: int) -> BubbleEntity:
        model = Bubble.objects.get(pk=pk)
        return self.mapper.to_entity(model)

    def get_by_user_pk(self, user_pk: int) -> BubbleEntity:
        model = Bubble.objects.get(user__pk=user_pk)
        return self.mapper.to_entity(model)


class BubbleRepositoryFactory:
    @staticmethod
    def create() -> BubbleRepository:
        mapper = BubbleDjangoMapper()
        return BubbleDjangoRepository(mapper)
