from apps.bubble.domain.entities.bubble import BubbleEntity
from apps.bubble.domain.value_objects.progress import Progress
from apps.bubble.infrastructure.models.bubble import Bubble


class BubbleDjangoMapper:
    @staticmethod
    def to_entity(model: Bubble) -> BubbleEntity:
        return BubbleEntity(
            id=model.pk,
            user_id=model.user.pk,
            rank_id=model.rank.pk,
            progress=Progress(model.progress),
        )

    @staticmethod
    def to_model(entity: BubbleEntity) -> Bubble:
        return Bubble(
            id=entity.id,
            user=entity.user_id,
            rank=entity.rank_id,
            progress=entity.progress.value,
        )
