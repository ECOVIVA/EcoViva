import re

from core.domain.exceptions import ValidationError

EMAIL_REGEX = re.compile(r"^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$")


class Email:
    def __init__(self, value: str) -> None:
        self._value = value
        if not EMAIL_REGEX.fullmatch(self._value):
            msg = "E-mail inválido."
            raise ValidationError(msg)

    @property
    def value(self) -> str:
        return self._value
