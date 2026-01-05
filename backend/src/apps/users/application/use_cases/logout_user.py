from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken


class LogoutUser:
    def execute(self, refresh_token: str) -> None:
        if not refresh_token:
            msg = "Refresh token não informado."
            raise ValueError(msg)

        try:
            refresh = RefreshToken(refresh_token)  # type: ignore
            refresh.blacklist()
        except TokenError as e:
            msg = "Token inválido ou expirado."
            raise ValueError(msg) from e
