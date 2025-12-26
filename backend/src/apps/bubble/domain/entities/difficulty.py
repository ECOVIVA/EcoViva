from dataclasses import dataclass


@dataclass(frozen=True)
class DifficultyEntity:
    name: str
    points_for_activity: int
