import json
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import permissions
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework.exceptions import AuthenticationFailed

from . import serializers
from apps.users.serializers import UsersSerializer

from rest_framework import status

class LoginView(APIView):
    """
    View de login que autentica o usuário com o email e senha fornecidos, 
    gera tokens de acesso e atualização, e os envia como cookies seguros.
    """
    # Define que qualquer usuário pode acessar esta view
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        """
        Método que recebe as credenciais de login, valida o usuário e gera 
        os tokens JWT necessários para a autenticação.
        """
        # Serializa os dados de login recebidos na requisição
        serializer = serializers.LoginUserSerializer(data=request.data)

        # Se a validação do serializer falhar, retorna erro 400 com detalhes
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # Recupera o usuário validado pelo serializer
        user = serializer.validated_data['user']

        # Gera os tokens de acesso e atualização
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)

        # Serializa os dados do usuário para retorno
        user_data = UsersSerializer(user).data

        # Cria uma resposta com sucesso no login
        response = Response(
            {"detail": "Login realizado com sucesso."},
            status=status.HTTP_200_OK
        )

        # Define o cookie seguro para o token de acesso
        response.set_cookie(
            key='access_token',
            value=access_token,
            secure=True,
            httponly=True,
            samesite='None',
            max_age= 15*60  # Expiração do token de acesso: 15 minutos
        )

        # Define o cookie seguro para o token de atualização
        response.set_cookie(
            key='refresh_token',
            value=str(refresh),
            secure=True,
            httponly=True,
            samesite='None',
            max_age = 30*24*60*60  # Expiração do token de atualização: 30 dias
        )

        # Define o cookie de autenticação do usuário
        response.set_cookie(
            key='isAuthenticated',
            value = True,
            secure=True,
            httponly=False,
            samesite='None',
        )

        # Retorna a resposta com os cookies definidos
        return response
    
class LogoutView(APIView):
    """
    View de logout que exclui os cookies de autenticação quando o usuário
    decide sair do sistema.
    """
    def post(self, request):
        """
        Método que executa o logout, removendo os cookies de autenticação.
        """
        # Cria a resposta indicando que o logout foi bem-sucedido
        response = Response({"detail": "Logout realizado com sucesso."}, status=status.HTTP_200_OK)

        # Remove os cookies de acesso e atualização
        response.delete_cookie("access_token")
        response.delete_cookie("refresh_token")

        # Retorna a resposta de logout
        return response

class RefreshView(APIView):
    """
    View para atualizar o token de acesso utilizando o token de atualização.
    """
    def post(self, request):
        """
        Método que recebe o token de atualização dos cookies, valida e 
        gera um novo token de acesso.
        """
        # Recupera o token de atualização dos cookies
        refresh_token = request.COOKIES.get('refresh_token')

        # Se o token de atualização não estiver presente, retorna erro 401
        if not refresh_token:
            return Response({"detail": "Token de atualização não encontrado."}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            # Valida o token de atualização
            refresh = RefreshToken(refresh_token)

            # Gera um novo token de acesso
            access_token = str(refresh.access_token)

            # Cria a resposta com sucesso na atualização do token
            response = Response({"detail": "Token atualizado com sucesso."}, status=status.HTTP_200_OK)

            # Define o novo cookie de token de acesso
            response.set_cookie(
                'access_token',
                access_token,
                httponly=True,
                secure=True,
                samesite='None',
                max_age=300  # Expiração do token de acesso: 5 minutos
            )

            # Retorna a resposta com o novo token de acesso
            return response

        except Exception as e:
            # Se ocorrer algum erro ao validar ou gerar o token, retorna erro 401
            response = Response({"detail": "Erro ao atualizar o token."}, status=status.HTTP_401_UNAUTHORIZED)
            response.delete_cookie("access_token")  # Remove o cookie de token de acesso
            response.delete_cookie("refresh_token")  # Remove o cookie de token de atualização
            return response
        
class VerifyView(APIView):
    """
    View que verifica se o token de acesso enviado é válido.
    """
    def get(self, request):
        """
        Método que valida o token de acesso fornecido no cookie.
        """
        # Recupera o token de acesso dos cookies
        access_token = request.COOKIES.get('access_token')

        # Se o token de acesso não estiver presente, retorna erro 401
        if not access_token:
            return Response({"detail": "Token de acesso não encontrado."}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            # Tenta validar o token de acesso
            token = AccessToken(access_token)

            # Se o token for válido, retorna sucesso
            return Response({"detail": "Token válido."}, status=status.HTTP_200_OK)
        except AuthenticationFailed as e:
            # Se o token for inválido, retorna erro 401 com detalhes
            return Response({"detail": f"Token inválido: {str(e)}"}, status=status.HTTP_401_UNAUTHORIZED)
