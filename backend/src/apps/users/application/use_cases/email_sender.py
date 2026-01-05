from apps.users.application.ports.email_confirmations_sender import EmailConfirmationSender


class SendEmailConfirmation:
    def __init__(self, sender: EmailConfirmationSender) -> None:
        self.sender = sender

    def execute(
        self,
        *,
        user_id: int,
        email: str,
        is_active: bool,
    ) -> None:
        self.sender.send_confirmation(
            user_id=user_id,
            email=email,
            is_active=is_active,
        )
