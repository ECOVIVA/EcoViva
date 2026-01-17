from apps.bubble.application.dtos.bubble_profile import BubbleDTO
from apps.bubble.domain.entities.bubble import BubbleEntity
from apps.bubble.domain.entities.rank import RankEntity
from apps.bubble.domain.exceptions import RankNotFoundError
from apps.bubble.domain.value_objects.progress import Progress


class BubbleMapper:
    @staticmethod
    def to_entity(dto: BubbleDTO, rank: RankEntity) -> BubbleEntity:
        return BubbleEntity(
            id=dto.id,
            user_id=dto.user,
            rank=rank,
            progress=Progress(dto.progress),
        )

    @staticmethod
    def to_dto(entity: BubbleEntity) -> BubbleDTO:
        if entity.rank.id is None:
            raise RankNotFoundError

        return BubbleDTO(
            id=entity.id,
            user=entity.user_id,
            rank=entity.rank.id,
            progress=entity.progress.value,
        )
