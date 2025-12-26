from apps.bubble.domain.entities.rank import RankEntity
from apps.bubble.domain.exceptions import RankNotFoundError
from apps.bubble.infrastructure.model import Bubble, Rank


class RankRepository:
    def _get(self, **filters: object) -> RankEntity:
        try:
            rank = Rank.objects.get(**filters)
            return self._to_entity(rank)
        except Rank.DoesNotExist as e:
            raise RankNotFoundError from e

    def _to_entity(self, rank: Rank) -> "RankEntity":
        return RankEntity(
            id=rank.pk,
            name=rank.name,
            difficulty_id=rank.difficulty.pk,
            points=rank.points,
        )

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

    @staticmethod
    def update_rank(bubble: Bubble) -> None:
        next_rank = Rank.objects.filter(points__lte=bubble.progress).order_by("-points").first()
        if next_rank and next_rank != bubble.rank:
            bubble.rank = next_rank
            bubble.progress = 0
            bubble.save()
