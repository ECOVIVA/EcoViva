from dataclasses import dataclass

from apps.bubble.infrastructure.repositories.difficulty import DifficultyRepository


@dataclass
class RankEntity:
    id: int
    name: str
    difficulty_id: int
    points: int

    def create_rank(self, name: str, points: int) -> None:
        Rank.objects.get_or_create(name=name, difficulty=diff, points=points)

    @staticmethod
    def update_rank(bubble: Bubble) -> None:
        next_rank = Rank.objects.filter(points__lte=bubble.progress).order_by("-points").first()
        if next_rank and next_rank != bubble.rank:
            bubble.rank = next_rank
            bubble.progress = 0
            bubble.save()
