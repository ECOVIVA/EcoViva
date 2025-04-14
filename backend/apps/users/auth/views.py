import json
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from rest_framework import permissions, status
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.exceptions import PermissionDenied


from . import serializers
from apps.users.serializers import UsersSerializer

"""
    Este arquivo contém as views responsáveis pela autenticação dos usuários utilizando JWT.

    As views implementadas são:
    - `LoginView`: Autentica o usuário e gera tokens de acesso e atualização.
    - `LogoutView`: Revoga os tokens removendo os cookies de autenticação.
    - `RefreshView`: Atualiza o token de acesso a partir do token de atualização.
    - `VerifyView`: Verifica se um token de acesso é válido.

    Todas as respostas retornam mensagens informativas e status HTTP apropriados.
"""


class LoginView(APIView):
    """
    View para autenticação de usuários.

    - Recebe um email e senha no corpo da requisição.
    - Valida as credenciais e gera tokens JWT (acesso e atualização).
    - Define os tokens como cookies seguros para autenticação futura.
    """
    permission_classes = [permissions.AllowAny]  # Permite acesso sem autenticação prévia

    def post(self, request):
        """
        Processa o login do usuário.

        - Valida as credenciais usando o `LoginUserSerializer`.
        - Se válido, gera e retorna os tokens de acesso e atualização.
        - Define os tokens como cookies seguros.
        """
        serializer = serializers.LoginUserSerializer(data=request.data)

        # Se a validação do serializer falhar, retorna erro 400
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # Obtém o usuário autenticado
        user = serializer.validated_data['user']

        # Gera tokens JWT para o usuário
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)

        # Cria resposta de sucesso
        response = Response({"detail": "Login realizado com sucesso."}, status=status.HTTP_200_OK)

        # Define cookies seguros para autenticação
        response.set_cookie(
            key='access_token',
            value=access_token,
            secure=True,
            httponly=True,
            samesite='None',
            max_age=15 * 60  # Expira em 15 minutos
        )
        response.set_cookie(
            key='refresh_token',
            value=str(refresh),
            secure=True,
            httponly=True,
            samesite='None',
            max_age=30 * 24 * 60 * 60  # Expira em 30 dias
        )

        return response


class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    """
    View para logout de usuários.

    - Remove os cookies de autenticação, invalidando os tokens.
    - Responde com uma mensagem de sucesso no logout.
    """

    def post(self, request):
        """
        Processa o logout do usuário.

        - Remove os cookies de acesso e atualização.
        - Retorna uma resposta indicando que o logout foi bem-sucedido.
        """
        response = Response({"detail": "Logout realizado com sucesso."}, status=status.HTTP_200_OK)

        # Remove os cookies de autenticação
        response.delete_cookie("access_token")
        response.delete_cookie("refresh_token")

        return response


class RefreshView(APIView):
    """
    View para atualização do token de acesso.

    - Obtém o token de atualização dos cookies.
    - Valida o token e gera um novo token de acesso.
    - Define o novo token de acesso como cookie seguro.
    """

    def post(self, request):
        """
        Atualiza o token de acesso.

        - Recupera o token de atualização armazenado nos cookies.
        - Se válido, gera um novo token de acesso e o define como cookie seguro.
        - Se inválido, retorna erro 401 e remove os cookies antigos.
        """
        refresh_token = request.COOKIES.get('refresh_token')

        if not refresh_token:
            return Response({"detail": "Token de atualização não encontrado."}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            # Valida e cria um novo token de acesso
            refresh = RefreshToken(refresh_token)
            access_token = str(refresh.access_token)

            response = Response({"detail": "Token atualizado com sucesso."}, status=status.HTTP_200_OK)
            response.set_cookie(
                key='access_token',
                value=access_token,
                httponly=True,
                secure=True,
                samesite='None',
                max_age=300  # Expira em 5 minutos
            )

            return response

        except Exception as e:
            # Se a atualização falhar, remove os cookies antigos
            response = Response({"detail": "Erro ao atualizar o token."}, status=status.HTTP_401_UNAUTHORIZED)
            response.delete_cookie("access_token")
            response.delete_cookie("refresh_token")
            return response


class VerifyView(APIView):
    """
    View para verificar a validade do token de acesso.

    - Obtém o token de acesso dos cookies.
    - Valida o token e retorna uma mensagem indicando se é válido ou não.
    """

    def get(self, request):
        """
        Verifica a validade do token de acesso.

        - Recupera o token de acesso armazenado nos cookies.
        - Se válido, retorna status 200 com uma mensagem de sucesso.
        - Se inválido ou ausente, retorna erro 401.
        """
        access_token = request.COOKIES.get('access_token')

        if not access_token:
            return Response({"detail": "Token de acesso não encontrado."}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            # Valida o token de acesso
            AccessToken(access_token)
            return Response({"detail": "Token válido."}, status=status.HTTP_200_OK)
        except AuthenticationFailed as e:
            return Response({"detail": f"Token inválido: {str(e)}"}, status=status.HTTP_401_UNAUTHORIZED)

class ResetPasswordRequestView(APIView):
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
            if user.is_active:
                return Response({"message": "Usuário já está ativo."}, status=status.HTTP_400_BAD_REQUEST)

            # Envia o e-mail de ativação novamente
            send_confirmation_email(user)
            return Response({"message": "E-mail de confirmação reenviado com sucesso."}, status=status.HTTP_200_OK)
        except Users.DoesNotExist:
            return Response({"error": "E-mail não encontrado."}, status=status.HTTP_404_NOT_FOUND)

class PasswordResetConfirmView(APIView):
    def post(self, request, uidb64, token):
        from django.utils.http import urlsafe_base64_decode
        from django.contrib.auth.models import User
        from django.contrib.auth.tokens import default_token_generator

        try:
            uid = urlsafe_base64_decode(uidb64).decode()
            user = User.objects.get(pk=uid)
        except Exception:
            return Response({"error": "Link inválido"}, status=400)

        if default_token_generator.check_token(user, token):
            new_password = request.data.get("password")
            user.set_password(new_password)
            user.save()
            return Response({"message": "Senha redefinida com sucesso!"})
        return Response({"error": "Token inválido"}, status=400)