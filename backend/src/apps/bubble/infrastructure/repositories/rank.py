from typing import override

from apps.bubble.domain.entities.rank import RankEntity
from apps.bubble.domain.exceptions import RankNotFoundError
from apps.bubble.infrastructure.models.rank import Rank
from core.infrastructure.repositories.base import BaseRepository


class RankRepository(BaseRepository[RankEntity, Rank]):
    @override
    def _to_entity(self, model: Rank) -> "RankEntity":
        return RankEntity(
            id=model.pk,
            name=model.name,
            difficulty_id=model.difficulty.pk,
            points=model.points,
        )

    def save(self, entity: RankEntity) -> None:
        return super().save(entity)

    def list_ranks(self) -> list[RankEntity]:
        return self._list()

    def get_rank_by_pk(self, pk: int) -> RankEntity:
        return self._get(pk=pk)

    def get_rank_by_name(self, name: str) -> RankEntity:
        return self._get(name=name)

    def get_next_rank(self, current_points: int) -> RankEntity:
        try:
            rank = Rank.objects.filter(points__gt=current_points).order_by("-points").first()
            if not rank:
                raise RankNotFoundError
            return self._to_entity(rank)
        except Rank.DoesNotExist as e:
            raise RankNotFoundError from e

    def create_rank(self, name: str, diff_name: str, points: int) -> RankEntity:
        return self._create(name=name, difficulty=Rank.objects.get(name=diff_name), points=points)

    def rank_exists(self, name: str) -> bool:
        return Rank.objects.filter(name=name).exists()
