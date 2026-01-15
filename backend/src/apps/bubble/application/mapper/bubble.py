from apps.bubble.application.dtos.bubble_profile import BubbleDTO
from apps.bubble.domain.entities.bubble import BubbleEntity
from apps.bubble.domain.value_objects.progress import Progress


class BubbleMapper:
    @staticmethod
    def to_entity(dto: BubbleDTO) -> BubbleEntity:
        return BubbleEntity(
            id=dto.id,
            user_id=dto.user,
            rank_id=dto.rank,
            progress=Progress(dto.progress),
        )

    @staticmethod
    def to_dto(entity: BubbleEntity) -> BubbleDTO:
        return BubbleDTO(
            id=entity.id,
            user=entity.user_id,
            rank=entity.rank_id,
            progress=entity.progress.value,
        )
