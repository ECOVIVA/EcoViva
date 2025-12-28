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
    
class IsCommunityOwner(BasePermission):
    """
    Permite acesso apenas aos donos da bolha relacionada ao CheckIn.
    """
    message = "Somente o dono da comunidade pode realizar essa ação."

    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        return obj.owner == request.user

class IsCommunityAdmin(BasePermission):
    """
    Permite acesso apenas aos donos da bolha relacionada ao CheckIn.
    """
    message = "Você precisa ser administrador da comunidade para ter acesso a essa ação."

    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        return request.user in obj.admins.all() or request.user == obj.owner
     
class IsCommunityMember(BasePermission):
    message = "Somente membro da comunidade pode realizar essa ação."

    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        return request.user in obj.members.all() or request.user == obj.owner