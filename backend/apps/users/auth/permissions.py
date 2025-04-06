from rest_framework.permissions import BasePermission
    
class IsPostOwner(BasePermission):
    """
    Permite acesso apenas aos donos da bolha relacionada ao CheckIn.
    """
    message = "Você não tem permissão para fazer essa ação no post"

    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        return obj.author == request.user