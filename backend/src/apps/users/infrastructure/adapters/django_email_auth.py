from django.contrib.auth import get_user_model
from django.http import HttpRequest

from apps.users.application.use_cases.email_authenticator import (
    EmailAuthenticatorAssembler,
)
from apps.users.infrastructure.models.user import Users

User = get_user_model()


class DjangoEmailBackend:
    def authenticate(
        self, request: HttpRequest, email: str, password: str, **kwargs: object
    ) -> Users | None:
        authenticator = EmailAuthenticatorAssembler.create()
        return authenticator.authenticate(email=email, password=password)
