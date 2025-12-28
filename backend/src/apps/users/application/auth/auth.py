from django.contrib.auth.backends import BaseBackend  
from django.contrib.auth import get_user_model  
from rest_framework.exceptions import PermissionDenied

User = get_user_model()  # Obtém o modelo de usuário utilizado no projeto, seja o padrão ou customizado

class EmailBackend(BaseBackend):
    """
    Classe customizada para autenticação de usuário via e-mail e senha.
    Herda de BaseBackend para personalizar o processo de autenticação.
    """
    
    def authenticate(self, request, email=None, password=None, **kwargs):
        """
        Método que autentica o usuário utilizando o e-mail e senha.
        """
        try:
            # Tenta buscar o usuário com o e-mail informado
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            # Caso não encontre o usuário, retorna None (usuário não autenticado)
            return None

        # Verifica se a senha está correta e se o usuário pode ser autenticado (está ativo)
        if user.check_password(password) and self.user_can_authenticate(user):
            return user  # Retorna o usuário autenticado
        return None  # Caso a senha ou o usuário não sejam válidos, retorna None

    def get_user(self, user_id):
        """
        Método que recupera o usuário a partir do ID.
        """
        try:
            # Tenta buscar o usuário pelo ID fornecido
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            # Caso o usuário não seja encontrado, retorna None
            return None

    def user_can_authenticate(self, user):
        """
        Método que verifica se o usuário pode ser autenticado (se está ativo).
        """
        if user.is_active:
            return True
        else:
            raise PermissionDenied({'detail': "Autentique seu email para conseguir o acesso!!"})
