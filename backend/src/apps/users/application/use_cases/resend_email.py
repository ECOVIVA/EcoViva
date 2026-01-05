from apps.users.email.send_email import send_confirmation_email

from apps.users.infrastructure.models.user import Users


class ResendConfirmationEmailUseCase:
    def execute(self, email: str) -> str:
        user = Users.objects.filter(email=email).first()
        if not user:
            return "not_found"

        if user.is_active:
            return "already_active"

        send_confirmation_email(user)
        return "resent"
