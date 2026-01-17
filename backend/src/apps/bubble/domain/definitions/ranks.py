from collections.abc import Sequence
from dataclasses import dataclass
from typing import Final


@dataclass(frozen=True)
class RankDifinition:
    name: str
    difficulty: int
    points: int


RANKS: Final[Sequence[RankDifinition]] = (
    RankDifinition("Iniciante Verde", 1, 100),
    RankDifinition("Guardião do Eco", 1, 150),
    RankDifinition("Protetor do Planeta", 1, 200),
    RankDifinition("Defensor da Natureza", 2, 300),
    RankDifinition("Herói Sustentável", 2, 400),
    RankDifinition("Sustentável Líder", 2, 500),
    RankDifinition("Líder Verde", 3, 700),
    RankDifinition("Guardião da Floresta", 3, 800),
    RankDifinition("Protetor Global", 3, 1000),
)
