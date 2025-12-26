from dataclasses import dataclass

from apps.bubble.domain.value_objects.progress import Progress


@dataclass
class BubbleEntity:
    id: int
    user_id: int
    rank_id: int
    progress: Progress

    def increment_points_for_bubble(self, points: int) -> None:
        self.progress = Progress(self.progress.value).increment(points)
