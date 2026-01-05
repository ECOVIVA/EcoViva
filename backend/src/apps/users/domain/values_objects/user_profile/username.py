import re

from core.domain.exceptions import ValidationError


class Username:
    def __init__(self, value: str) -> None:
        self._value = value

        if re.search(r"\s", self._value):
            msg = "O nome de usuario não pode ter espaços."
            raise ValidationError(msg)

    @property
    def value(self) -> str:
        return self._value
