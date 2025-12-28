from dataclasses import dataclass
from datetime import datetime


@dataclass(frozen=True)
class CheckProfileInDTO:
    bubble_id: int
    description: str
    xp_earned: int
    created_at: datetime


@dataclass(frozen=True)
class BubbleProfileDTO:
    user_id: int
    progress: int
    rank_name: str
    difficulty_name: str
