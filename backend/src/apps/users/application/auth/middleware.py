from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.permissions import AllowAny

class CookieJWTAuthentication(JWTAuthentication):
    """
    Customização da autenticação JWT para obter o token de acesso a partir dos cookies.
    Herda de JWTAuthentication e sobrescreve o método 'authenticate' para personalizar a lógica de autenticação.
    """
    
    def authenticate(self, request):
        """
        Método que tenta autenticar o usuário, verificando se a permissão AllowAny está presente e 
        se um token de autenticação foi fornecido nos cookies da requisição.
        """
        # Verifica se a permissão 'AllowAny' está presente na view da requisição
        if any(isinstance(perm(), AllowAny) for perm in request.resolver_match.func.view_class.permission_classes):
            # Se a permissão AllowAny estiver presente, não faz autenticação e retorna None
            return None

        # Obtém o token de acesso dos cookies da requisição
        token = request.COOKIES.get("access_token")

        # Se não houver token nos cookies, não faz autenticação e retorna None
        if not token:
            return None
        
        try:
            # Valida o token utilizando o método da classe base (JWTAuthentication)
            validated_token = self.get_validated_token(token)
        except AuthenticationFailed as e:
            # Caso a validação do token falhe, lança uma exceção com a mensagem de erro
            raise AuthenticationFailed(f"Validação de token falhada:{str(e)}")
        
        try:
            # Tenta obter o usuário associado ao token validado
            user = self.get_user(validated_token)
            return (user, validated_token)  # Retorna o usuário e o token validado
        except AuthenticationFailed as e:
            # Caso haja um erro ao retornar o usuário, lança uma exceção com a mensagem de erro
            raise AuthenticationFailed(f"Erro ao retornar o usuario: {str(e)}")
