from apps.bubble.infrastructure.model import Difficulty


class DifficultyRepository:
    @staticmethod
    def create_difficulty(name: str, points: int) -> None:
        Difficulty.objects.get_or_create(name=name, points_for_activity=points)
