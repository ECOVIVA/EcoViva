from typing import cast

from rest_framework import permissions, status
from rest_framework.generics import GenericAPIView
from rest_framework.request import Request
from rest_framework.response import Response

from apps.users.application.services.auth import AuthFacadeAssembler
from apps.users.interface.serializers.login import LoginSerializer


class LoginView(GenericAPIView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = LoginSerializer

    def post(self, request: Request) -> Response:
        serializer = self.get_serializer(data=request.data)

        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"]
        password = serializer.validated_data["password"]

        auth = AuthFacadeAssembler.create()

        token = auth.login(email=email, password=password)

        return Response(
            {"refresh_token": token, "access_token": token.access_token}, status=status.HTTP_200_OK
        )


class RefreshView(GenericAPIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request: Request) -> Response:
        refresh_token = cast("str", request.data.get("refresh_token"))
        auth = AuthFacadeAssembler.create()

        try:
            access_token = auth.refresh(refresh_token=refresh_token)
            return Response({"access_token": access_token}, status=status.HTTP_200_OK)
        except ValueError as e:
            return Response({"detail": str(e)}, status=status.HTTP_401_UNAUTHORIZED)


class LogoutView(GenericAPIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request: Request) -> Response:
        auth = AuthFacadeAssembler.create()
        refresh_token = cast("str", request.data.get("refresh_token"))

        auth.logout(refresh_token=refresh_token)
        return Response({"detail": "Logout realizado com sucesso."}, status=status.HTTP_200_OK)
