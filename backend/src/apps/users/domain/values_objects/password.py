import re
from dataclasses import dataclass

from core.domain.exceptions import ValidationError


@dataclass(frozen=True)
class Password:
    value: str

    def __post_init__(self) -> None:
        if len(self.value) < 8:
            msg = "A senha precisa ter ao menos, 8 caracteres."
            raise ValidationError(msg)

        if not re.search(r"[a-z]", self.value):
            msg = "A senha precisa ter ao menos, uma letra minuscula."
            raise ValidationError(msg)

        if not re.search(r"[A-Z]", self.value):
            msg = "A senha precisa ter ao menos, uma letra maiuscula."
            raise ValidationError(msg)

        if not re.search(r"\d", self.value):
            msg = "A senha precisa ter ao menos, um numero."
            raise ValidationError(msg)

        if not re.search(r"[^\w\s]", self.value):
            msg = "A senha precisa ter ao menos, um caractere especial."
            raise ValidationError(msg)

        if re.search(r"\s", self.value):
            msg = "A senha não pode ter espaços."
            raise ValidationError(msg)
