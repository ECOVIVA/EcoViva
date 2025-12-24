from apps.bubble.infrastructure.model import Difficulty, Rank


class RankRepository:
    @staticmethod
    def create_rank(name: str, diff_name: str, points: int) -> None:
        difficulty = Difficulty.objects.get(name=diff_name)
        Rank.objects.get_or_create(name=name, difficulty=difficulty, points=points)
