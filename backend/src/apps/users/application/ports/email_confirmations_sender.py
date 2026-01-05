from typing import Protocol


class EmailConfirmationSender(Protocol):
    def send_confirmation(
        self,
        *,
        user_id: int,
        email: str,
        is_active: bool,
    ) -> None:
        pass
