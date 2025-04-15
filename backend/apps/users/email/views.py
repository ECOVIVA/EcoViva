from django.shortcuts import get_object_or_404
from django.urls import reverse
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.utils.encoding import force_str, force_bytes
from django.core.mail import send_mail
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.utils.http import urlsafe_base64_decode
from django.contrib.auth.tokens import default_token_generator

from ..models import Users
from ..serializers import UsersSerializer
from .tokens import email_confirmation_token
from .send_email import send_reset_password

"""
    Este arquivo contém as views responsáveis pela confirmação e reenvio de e-mails de ativação de conta.

    As views implementadas são:
    - `EmailConfirmAPIView`: Confirma o e-mail do usuário ao acessar o link de ativação enviado por e-mail.
    - `ResendConfirmationEmailView`: Reenvia o e-mail de ativação caso o usuário ainda não tenha ativado a conta.

    Ambas as views garantem segurança e verificações adequadas para evitar reativações desnecessárias.
"""


class EmailConfirmAPIView(APIView):
    """
    View para confirmação de e-mail do usuário.

    - Recebe um `uidb64` e um `token` na URL.
    - Decodifica o ID do usuário e verifica se o token é válido.
    - Se válido, ativa a conta do usuário.
    """
    permission_classes = [permissions.AllowAny]  # Permite acesso sem autenticação

    def get(self, request, uidb64, token):
        """
        Confirma o e-mail do usuário.

        - Decodifica o ID do usuário.
        - Verifica se o usuário já está ativo.
        - Valida o token de confirmação.
        - Se válido, ativa o usuário e retorna uma mensagem de sucesso.
        """
        try:
            # Decodifica o ID do usuário
            uid = force_str(urlsafe_base64_decode(uidb64))

            # Busca o usuário no banco de dados ou retorna 404 se não encontrado
            user = get_object_or_404(Users, pk=uid)

            # Se o usuário já estiver ativo, retorna uma resposta informando isso
            if user.is_active:
                return Response({"detail": "O usuário já tem o e-mail autenticado."}, status=status.HTTP_400_BAD_REQUEST)

            # Verifica se o token é válido
            if email_confirmation_token.check_token(user, token):
                user.is_active = True  # Ativa a conta do usuário
                user.save()  # Salva a alteração no banco de dados
                return Response({"message": "E-mail confirmado com sucesso!"}, status=status.HTTP_200_OK)
            else:
                return Response({"detail": "Token inválido ou expirado."}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            # Em caso de erro inesperado, retorna uma mensagem genérica
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        

class PasswordResetRequestView(APIView):
    """
    View para reenvio do e-mail de ativação.

    - Recebe um e-mail na requisição.
    - Verifica se o usuário existe e se ainda não ativou a conta.
    - Se não ativado, reenvia o e-mail de confirmação.
    """

    def post(self, request):
        """
        Reenvia o e-mail de ativação.

        - Obtém o e-mail enviado na requisição.
        - Verifica se o usuário existe no banco de dados.
        - Se o usuário já estiver ativo, retorna erro.
        - Se ainda não ativado, reenvia o e-mail de confirmação.
        """
        email = request.data.get("email")  # Obtém o e-mail enviado na requisição

        try:
            # Busca o usuário pelo e-mail ou retorna erro se não encontrado
            user = Users.objects.get(email=email)

            # Se o usuário já estiver ativo, não envia o e-mail novamente
            if not user.is_active:
                return Response({"detail": "Autentique o email para poder fazer essa ação."}, status=status.HTTP_400_BAD_REQUEST)

            # Envia o e-mail de ativação novamente
            send_reset_password(user)
            return Response({"detail": "E-mail de confirmação reenviado com sucesso."}, status=status.HTTP_200_OK)
        except Users.DoesNotExist:
            return Response({"detail": "E-mail não encontrado."}, status=status.HTTP_404_NOT_FOUND)

class PasswordResetConfirmView(APIView):
    def post(self, request, uidb64, token):
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = Users.objects.get(pk=uid)
        except Exception as e:
            return Response({"detail": str(e)}, status = status.HTTP_400_BAD_REQUEST)

        if email_confirmation_token.check_token(user, token):

            serializer = UsersSerializer(user, data = request.data, partial = True)
            if serializer.is_valid():
                serializer.save()
                return Response({"detail": "Senha redefinida com sucesso!"}, status = status.HTTP_200_OK)
            
            return Response({"detail": serializer.errors}, status = status.HTTP_400_BAD_REQUEST)
        return Response({"detail": "Token inválido"}, status = status.HTTP_400_BAD_REQUEST)