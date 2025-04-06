from rest_framework.permissions import BasePermission

class IsBubbleOwner(BasePermission):
    """
    Permite acesso apenas aos donos da bolha relacionada ao CheckIn.
    """

    message = "Você não tem permissão para fazer essa ação na Bolha"

    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated
    
    def has_object_permission(self, request, view, obj):
        # Garante que o usuário autenticado é o dono da bolha do check-in
        return obj.bubble.user == request.user
    
class IsPostOwner(BasePermission):
    """
    Permite acesso apenas aos donos da bolha relacionada ao CheckIn.
    """
    message = "Você não tem permissão para fazer essa ação no post"

    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        # Garante que o usuário autenticado é o dono da bolha do check-i
        return obj.author == request.user