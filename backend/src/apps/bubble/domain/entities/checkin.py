from dataclasses import dataclass


@dataclass
class CheckInEntity:
    id: int
    bubble_id: int
    description: str
    xp_earned: int
