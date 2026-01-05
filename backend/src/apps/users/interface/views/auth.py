from typing import TYPE_CHECKING, cast

from rest_framework import permissions, status
from rest_framework.generics import GenericAPIView
from rest_framework.request import Request
from rest_framework.response import Response

if TYPE_CHECKING:
    from rest_framework_simplejwt.tokens import Token

from apps.users.application.use_cases.login_user import LoginUserAssembler
from apps.users.application.use_cases.refresh_user import RefreshTokenUseCase
from apps.users.interface.serializers.auth import LoginSerializer


class LoginView(GenericAPIView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = LoginSerializer

    def post(self, request: Request) -> Response:
        serializer = self.get_serializer(data=request.data)

        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"]
        password = serializer.validated_data["password"]

        usecase = LoginUserAssembler.create()

        tokens = usecase.execute(email=email, password=password)

        return Response(
            {"detail": "Login realizado com sucesso.", **tokens}, status=status.HTTP_200_OK
        )


class RefreshView(GenericAPIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request: Request) -> Response:
        refresh_token = cast("Token", request.data.get("refresh_token"))

        try:
            access_token = RefreshTokenUseCase().execute(refresh_token)
            return Response({"access_token": access_token}, status=status.HTTP_200_OK)
        except ValueError as e:
            return Response({"detail": str(e)}, status=status.HTTP_401_UNAUTHORIZED)


class LogoutView(GenericAPIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request: Request) -> Response:
        return Response({"detail": "Logout realizado com sucesso."}, status=status.HTTP_200_OK)
