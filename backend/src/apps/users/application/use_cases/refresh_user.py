from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken, Token


class RefreshTokenUseCase:
    def execute(self, refresh_token: Token) -> str:
        if not refresh_token:
            msg = "Token não encontrado."
            raise ValueError(msg)

        try:
            refresh = RefreshToken(token=refresh_token)
            return str(refresh.access_token)

        except TokenError as e:
            msg = "Token inválido ou expirado."
            raise ValueError(msg) from e
