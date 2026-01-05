from django.shortcuts import get_object_or_404
from django.utils.encoding import force_str
from django.utils.http import urlsafe_base64_decode

from apps.users.infrastructure.models.user import Users
from apps.users.infrastructure.tokens.email import (
    email_confirmation_token,
)


class ConfirmEmail:
    def execute(self, uidb64: str, token: str) -> None:
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = get_object_or_404(Users, pk=uid)

        if user.is_active:
            return

        if email_confirmation_token.check_token(user, token):
            user.is_active = True
            user.save()
            return
