from dataclasses import dataclass
from typing import cast

from django.conf import settings
from django.contrib.auth.models import AbstractBaseUser
from django.core.mail import EmailMultiAlternatives
from django.template.loader import get_template
from django.urls import reverse
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode

from apps.users.application.ports.email_confirmations_sender import (
    EmailConfirmationSender,
)
from apps.users.application.use_cases.email_sender import SendEmailConfirmationUseCase
from apps.users.infrastructure.tokens.email import email_confirmation_token


@dataclass(slots=True)
class _UserTokenSubject:
    pk: int
    is_active: bool


class DjangoEmailConfirmationSender(EmailConfirmationSender):
    def send_confirmation(
        self,
        *,
        user_id: int,
        email: str,
        is_active: bool,
    ) -> None:
        confirmation_url = self._build_confirmation_url(
            user_id=user_id,
            is_active=is_active,
        )

        self._send_email(
            email=email,
            confirmation_url=confirmation_url,
        )

    def _build_confirmation_url(self, *, user_id: int, is_active: bool) -> str:
        uidb64 = urlsafe_base64_encode(force_bytes(user_id))

        token_subject = _UserTokenSubject(
            pk=user_id,
            is_active=is_active,
        )

        token = email_confirmation_token.make_token(cast("AbstractBaseUser", token_subject))

        return settings.BACKEND_URL + reverse(
            "confirm_email",
            args=[uidb64, token],
        )

    def _send_email(self, *, email: str, confirmation_url: str) -> None:
        context = {"confirmation_url": confirmation_url}

        html = get_template("users/confirm_email.html").render(context)
        text = f"Clique no link para confirmar seu e-mail: {confirmation_url}"

        message = EmailMultiAlternatives(
            subject="Confirme seu e-mail",
            body=text,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[email],
        )

        message.attach_alternative(html, "text/html")
        message.send()


class EmailConfirmationAssembler:
    @staticmethod
    def create() -> SendEmailConfirmationUseCase:
        return SendEmailConfirmationUseCase(sender=DjangoEmailConfirmationSender())
