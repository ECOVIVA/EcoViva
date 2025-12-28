from dataclasses import dataclass


@dataclass(frozen=True)
class Password:
    value: str

    def __post_init__(self):
        ...