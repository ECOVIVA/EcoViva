class DomainError(Exception):
    def __init__(self, message: str) -> None:
        super().__init__(message)


class BubbleNotFoundError(DomainError):
    def __init__(self, message: str | None = None) -> None:
        super().__init__(message or "Bubble not found for the given user.")


class DifficultyNotFoundError(DomainError):
    def __init__(self, message: str | None = None) -> None:
        super().__init__(message or "Difficulty not found for the given pk.")


class RankNotFoundError(DomainError):
    def __init__(self, message: str | None = None) -> None:
        super().__init__(message or "Rank not found for the given pk.")


class InvalidBubbleProgressError(DomainError):
    def __init__(self, message: str | None = None) -> None:
        super().__init__(message or "Pontos de progresso inválidos para o Bubble.")
