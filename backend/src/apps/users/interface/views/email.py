from apps.users.application.use_cases.email_confirmation import (
    ConfirmEmailUseCase,
    ResendConfirmationEmailUseCase,
)
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView


class EmailConfirmAPIView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, uidb64, token):
        usecase = ConfirmEmailUseCase()
        result = usecase.execute(uidb64=uidb64, token=token)

        if result == "confirmed":
            return Response(
                {"message": "E-mail confirmado com sucesso!"}, status=status.HTTP_200_OK
            )
        if result == "already_active":
            return Response(
                {"detail": "O usuário já tem o e-mail autenticado."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        return Response(
            {"error": "Token inválido ou expirado."}, status=status.HTTP_400_BAD_REQUEST
        )


class ResendConfirmationEmailView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get("email")
        usecase = ResendConfirmationEmailUseCase()
        result = usecase.execute(email=email)

        if result == "resent":
            return Response(
                {"message": "E-mail de confirmação reenviado com sucesso."},
                status=status.HTTP_200_OK,
            )
        if result == "already_active":
            return Response(
                {"message": "Usuário já está ativo."}, status=status.HTTP_400_BAD_REQUEST
            )
        return Response({"error": "E-mail não encontrado."}, status=status.HTTP_404_NOT_FOUND)
