from dataclasses import dataclass


@dataclass(frozen=True)
class Photo:
    path: str
