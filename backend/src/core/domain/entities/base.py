from abc import ABC
from dataclasses import dataclass


@dataclass
class Entity(ABC):
    id: int

    def __eq__(self, other: object) -> bool:
        if not isinstance(other, Entity):
            return False
        return self.id == other.id
