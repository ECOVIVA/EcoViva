from apps.users.email.tokens import email_confirmation_token
from apps.users.models import Users
from django.shortcuts import get_object_or_404


class ConfirmEmailUseCase:
    def execute(self, uidb64: str, token: str) -> str:
        from django.utils.encoding import force_str
        from django.utils.http import urlsafe_base64_decode

        uid = force_str(urlsafe_base64_decode(uidb64))
        user = get_object_or_404(Users, pk=uid)

        if user.is_active:
            return "already_active"

        if email_confirmation_token.check_token(user, token):
            user.is_active = True
            user.save()
            return "confirmed"
        return "invalid_token"
