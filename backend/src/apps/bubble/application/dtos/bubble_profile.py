from dataclasses import dataclass


@dataclass(frozen=True)
class BubbleDTO:
    id: int
    user: int
    progress: int
    rank: int
