from dataclasses import dataclass

from core.domain.exceptions import ValidationError


@dataclass(frozen=True)
class Bio:
    value: str

    def __post_init__(self) -> None:
        max_line_breaks = 5
        line_breaks = self.value.count("\n")

        if line_breaks > max_line_breaks:
            e_msg = f"Máximo de {max_line_breaks} quebras de linha permitidas."

            raise ValidationError(e_msg)
