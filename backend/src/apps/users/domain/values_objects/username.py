import re
from dataclasses import dataclass

from core.domain.exceptions import ValidationError


@dataclass(frozen=True)
class Username:
    value: str

    def __post_init__(self) -> None:
        if re.search(r"\s", self.value):
            msg = "O nome de usuario não pode ter espaços."
            raise ValidationError(msg)
