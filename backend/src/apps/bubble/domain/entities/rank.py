from dataclasses import dataclass

from core.domain.entities.base import Entity


@dataclass
class RankEntity(Entity):
    id: int
    name: str
    difficulty_id: int
    points: int

    def can_create_rank(self, ranks_list: list["RankEntity"], name: str) -> None:
        if any(self.name == rank.name for rank in ranks_list):
            error_msg = f"Rank with name '{name}' already exists."
            raise ValueError(error_msg)
