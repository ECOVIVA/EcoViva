from apps.users.application.use_cases.email_confirm import ConfirmEmail
from apps.users.application.use_cases.email_sender import SendEmailConfirmation
from apps.users.infrastructure.adapters.django_email_confirmation import (
    DjangoEmailConfirmationSender,
)


class EmailFacade:
    def __init__(self, send_class: SendEmailConfirmation, confirm_class: ConfirmEmail) -> None:
        self.send_class = send_class
        self.confirm_class = confirm_class

    def send_email(self, user_id: int, email: str, *, is_active: bool) -> None:
        self.send_class.execute(user_id=user_id, email=email, is_active=is_active)

    def confirm_email(self, uidb64: str, token: str) -> None:
        self.confirm_class.execute(uidb64, token)


class EmailFacadeAssembler:
    @staticmethod
    def create() -> EmailFacade:
        django_sender = DjangoEmailConfirmationSender()

        sender = SendEmailConfirmation(django_sender)
        confirm = ConfirmEmail()

        return EmailFacade(sender, confirm)
