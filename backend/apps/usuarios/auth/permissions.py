from rest_framework.permissions import BasePermission

class IsUserAuthenticated(BasePermission):
    """
    Permissão personalizada que permite leitura para qualquer usuário,
    mas permite edição e exclusão apenas para o dono do objeto.
    """

    def has_permission(self, request, view):
        # Verifica se o usuário está autenticado
        return bool(request.user and request.user.is_authenticated)

    def has_object_permission(self, request, view, obj):
        # Permite apenas se o usuário autenticado for o dono do objeto
        return obj == request.user
    
class IsOwnerOrReadOnly(BasePermission):
    """
    Permissão personalizada que permite leitura para qualquer usuário,
    mas permite edição e exclusão apenas para o dono do objeto.
    """

    def has_permission(self, request, view):
        # Permitir ações de leitura para todos os usuários.
        if request.method in ['GET', 'HEAD', 'OPTIONS']:
            return True
        # Se for uma ação de escrita, o usuário deve ser o dono
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        # Verifica se o usuário é o dono do objeto
        return obj.bubble.user == request.user
    
class IsOwner(BasePermission):
    """
    Permite acesso apenas aos donos da bolha relacionada ao CheckIn.
    """

    def has_object_permission(self, request, view, obj):
        # Garante que o usuário autenticado é o dono da bolha do check-in
        return obj.bubble.user == request.user