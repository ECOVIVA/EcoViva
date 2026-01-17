from dataclasses import dataclass


@dataclass
class DifficultyEntity:
    name: str
    points_for_activity: int
