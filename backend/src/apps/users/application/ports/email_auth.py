from typing import Protocol

from apps.users.infrastructure.models.user import Users


class EmailAuthenticator(Protocol):
    def authenticate(self, *, email: str, password: str) -> Users: ...
