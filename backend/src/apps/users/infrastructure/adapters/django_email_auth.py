from django.contrib.auth import get_user_model
from django.http import HttpRequest

from apps.users.application.use_cases.authenticator import DjangoAuthenticator
from apps.users.infrastructure.models.user import Users
from apps.users.infrastructure.repositories.user import UserRepositoryAssembler

User = get_user_model()


class DjangoEmailBackend:
    def authenticate(
        self, request: HttpRequest, email: str, password: str, **kwargs: object
    ) -> Users:
        repo = UserRepositoryAssembler.create()

        authenticator = DjangoAuthenticator(repo)

        return authenticator.authenticate(email=email, password=password)
