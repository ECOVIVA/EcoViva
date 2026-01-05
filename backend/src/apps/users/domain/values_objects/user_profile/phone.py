import re
from dataclasses import dataclass

from core.domain.exceptions import ValidationError


@dataclass(frozen=True)
class Phone:
    value: str

    def __post_init__(self) -> None:
        if not re.fullmatch(r"\d+", self.value):
            e_msg = "O numero de telefone, precisar sr totalmente numerico."
            raise ValidationError(e_msg)

        if not re.fullmatch(r"\d{11}", self.value):
            e_msg = "Número de telefone inválido. Formato aceito:  XX9XXXXXXXX."
            raise ValidationError(e_msg)
