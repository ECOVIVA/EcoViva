from rest_framework_simplejwt.tokens import RefreshToken

from apps.users.application.ports.email_auth import Authenticator


class LoginUser:
    def __init__(self, authenticator: Authenticator) -> None:
        self.authenticator = authenticator

    def execute(self, email: str, password: str) -> RefreshToken:
        user = self.authenticator.authenticate(email=email, password=password)
        return RefreshToken.for_user(user)
