import re
from dataclasses import dataclass

from core.domain.exceptions import ValidationError

EMAIL_REGEX = re.compile(r"^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$")


@dataclass(frozen=True)
class Email:
    value: str

    def __post_init__(self) -> None:
        if not EMAIL_REGEX.fullmatch(self.value):
            msg = "E-mail inválido."
            raise ValidationError(msg)
