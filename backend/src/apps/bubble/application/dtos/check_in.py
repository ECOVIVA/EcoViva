from dataclasses import dataclass
from datetime import datetime


@dataclass(frozen=True)
class CheckInDTO:
    id: int
    bubble_id: int
    description: str
    xp_earned: int
    created_at: datetime


@dataclass(frozen=True)
class CheckInCreateDTO:
    bubble_id: int
    description: str
