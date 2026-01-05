from rest_framework_simplejwt.tokens import RefreshToken

from apps.users.application.ports.email_auth import EmailAuthenticator
from apps.users.application.use_cases.email_authenticator import EmailAuthenticatorAssembler


class LoginUser:
    def __init__(self, authenticator: EmailAuthenticator) -> None:
        self.authenticator = authenticator

    def execute(self, email: str, password: str) -> dict[str, str]:
        user = self.authenticator.authenticate(email=email, password=password)
        refresh = RefreshToken.for_user(user)

        return {
            "access_token": str(refresh.access_token),
            "refresh_token": str(refresh),
        }


class LoginUserAssembler:
    @staticmethod
    def create() -> LoginUser:
        auth = EmailAuthenticatorAssembler.create()

        return LoginUser(auth)
