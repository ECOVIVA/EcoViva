from collections.abc import Sequence
from dataclasses import dataclass
from typing import Final


@dataclass(frozen=True)
class RankDifinition:
    name: str
    difficulty: str
    points: int



RANKS: Final[Sequence[RankDifinition]] = (
    RankDifinition("Iniciante Verde", "Easy", 100),
    RankDifinition("Guardião do Eco", "Easy", 150),
    RankDifinition("Protetor do Planeta", "Easy", 200),
    RankDifinition("Defensor da Natureza", "Medium", 300),
    RankDifinition("Herói Sustentável", "Medium", 400),
    RankDifinition("Sustentável Líder", "Medium", 500),
    RankDifinition("Líder Verde", "Hard", 700),
    RankDifinition("Guardião da Floresta", "Hard", 800),
    RankDifinition("Protetor Global", "Hard", 1000),
)
