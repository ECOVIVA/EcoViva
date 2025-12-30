from apps.users.email.send_email import send_confirmation_email
from apps.users.email.tokens import email_confirmation_token
from apps.users.models import Users
from django.shortcuts import get_object_or_404
from django.utils.encoding import force_str
from django.utils.http import urlsafe_base64_decode
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView


class EmailConfirmAPIView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, uidb64, token):
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))

            user = get_object_or_404(Users, pk=uid)

            if user.is_active:
                return Response(
                    {"detail": "O usuário já tem o e-mail autenticado."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            if email_confirmation_token.check_token(user, token):
                user.is_active = True
                user.save()
                return Response(
                    {"message": "E-mail confirmado com sucesso!"}, status=status.HTTP_200_OK
                )
            return Response(
                {"error": "Token inválido ou expirado."}, status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class ResendConfirmationEmailView(APIView):
    def post(self, request):
        email = request.data.get("email")

        try:
            user = Users.objects.get(email=email)

            if user.is_active:
                return Response(
                    {"message": "Usuário já está ativo."}, status=status.HTTP_400_BAD_REQUEST
                )

            send_confirmation_email(user)
            return Response(
                {"message": "E-mail de confirmação reenviado com sucesso."},
                status=status.HTTP_200_OK,
            )
        except Users.DoesNotExist:
            return Response({"error": "E-mail não encontrado."}, status=status.HTTP_404_NOT_FOUND)
