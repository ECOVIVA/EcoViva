from apps.bubble.infrastructure.model import Bubble, Rank


class RankRepository:
    @staticmethod
    def get_rank_by_name(name: str) -> Rank | None:
        try:
            return Rank.objects.get(name=name)
        except Rank.DoesNotExist:
            return None

    @staticmethod
    def create_rank(name: str, diff_name: str, points: int) -> None:
        diff = RankRepository.get_rank_by_name(name=diff_name)
        Rank.objects.get_or_create(name=name, difficulty=diff, points=points)

    @staticmethod
    def update_rank(bubble: Bubble) -> None:
        next_rank = Rank.objects.filter(points__lte=bubble.progress).order_by("-points").first()
        if next_rank and next_rank != bubble.rank:
            bubble.rank = next_rank
            bubble.progress = 0
            bubble.save()
