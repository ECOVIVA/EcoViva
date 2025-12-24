from collections.abc import Sequence
from dataclasses import dataclass


@dataclass
class DifficultyDefinition:
    name: str
    points_for_activity: int


DIFFICULTIES: Sequence[DifficultyDefinition] = (
    DifficultyDefinition(name="Easy", points_for_activity=50),
    DifficultyDefinition(name="Medium", points_for_activity=30),
    DifficultyDefinition(name="Hard", points_for_activity=10),
)
