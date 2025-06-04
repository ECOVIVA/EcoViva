from rest_framework.generics import GenericAPIView, ListAPIView, CreateAPIView, UpdateAPIView, RetrieveAPIView, DestroyAPIView
from rest_framework.response import Response  
from rest_framework.exceptions import NotFound
from rest_framework import status, permissions  

from apps.users.auth.permissions import IsCommunityAdmin, IsCommunityMember, IsCommunityOwner
from apps.community.models.community import Community
from apps.community.serializers.community import CommunitySerializer, UsersSerializer
from utils.mixins.community_mixins import CommunityViewMixin
    
class CommunityListView(CommunityViewMixin, ListAPIView):
    permission_classes = [permissions.IsAuthenticated]  
    serializer_class = CommunitySerializer

    def get_queryset(self):
        return self.get_community_list()
    
class CommunityObjectView(CommunityViewMixin, RetrieveAPIView):
    permission_classes = [IsCommunityMember]  
    serializer_class = CommunitySerializer

    def get_object(self):
        community_slug = self.kwargs.get('slug')
        object = self.get_community_object(community_slug)
        self.check_object_permissions(self.request, object)
        return object

class CommunityRegisterUser(CommunityViewMixin, CreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    def post(self, request,*args, **kwargs):
        community_slug = self.kwargs.get('slug')
        user = request.user

        community = self.get_community_object(community_slug)
        
        if community.is_private:
            community.pending_requests.add(user)
            return Response({'detail': 'Usuário adicionado a lista de pendencias.'}, status=status.HTTP_200_OK)
        else:
            community.members.add(user)
            return Response({'detail': 'Usuário adicionado ao grupo.'}, status=status.HTTP_200_OK)     
    
class CommunityPendingRequestsView(CommunityViewMixin, ListAPIView):
    permission_classes = [IsCommunityAdmin]  
    serializer_class = UsersSerializer

    def get_queryset(self):    
        community_slug = self.kwargs.get('slug')
    
        community = self.get_community_object(community_slug)
        self.check_object_permissions(self.request, community)
        return community.pending_requests.all()  

class CommunityConfirmationRequestsView(CommunityViewMixin, GenericAPIView):
    permission_classes = [IsCommunityAdmin]
    serializer_class = CommunitySerializer

    def post(self, request, *args, **kwargs):
        community_slug = self.kwargs.get('slug')
        request_id = request.data.get('request_id')
        confirmation = request.data.get('confirmation')

        if confirmation is None or not isinstance(confirmation, bool):
            return Response(
                {'detail': 'A confirmação deve ser um booleano.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        community = self.get_community_object(community_slug)

        self.check_object_permissions(self.request, community)
        user = community.pending_requests.filter(id = request_id).first()
        
        if confirmation:
            if user:
                community.pending_requests.remove(user)
                community.members.add(user)
                return Response({'detail': 'Usuário confirmado como membro.'}, status=status.HTTP_200_OK)
            return Response({'detail': 'Usuário não está na lista de solicitações pendentes.'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            community.pending_requests.remove(user)
            return Response({'detail': 'Solicitação negada com sucesso.'}, status=status.HTTP_200_OK)


class CommunityCreateView(CreateAPIView):  
    """ Cria uma nova thread. Apenas usuários autenticados podem acessar. """  
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = CommunitySerializer  

    def create(self, request, *args, **kwargs):
        data = request.data.copy()  

        data["owner"] = request.user.pk

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response({'detail': 'Comunidade criada com sucesso!'}, status=status.HTTP_201_CREATED)

class CommunityUpdateView(CommunityViewMixin, UpdateAPIView):  
    permission_classes = [IsCommunityAdmin]  
    serializer_class = CommunitySerializer

    def get_object(self):
        community_slug = self.kwargs.get('slug')

        object = self.get_community_object(community_slug)
        self.check_object_permissions(self.request, object)
        return object
        
    def partial_update(self, request, *args, **kwargs):
            instance = self.get_object()
            serializer = self.get_serializer(instance, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)

            if getattr(instance, '_prefetched_objects_cache', None):
                instance._prefetched_objects_cache = {}

            return Response({'detail': 'Comunidade atualizada com sucesso!'}, status=status.HTTP_200_OK)  
    
class CommunityDeleteView(CommunityViewMixin, DestroyAPIView):  
    permission_classes = [IsCommunityOwner]  

    def get_object(self):
        community_slug = self.kwargs.get('slug')

        object = self.get_community_object(community_slug)
        self.check_object_permissions(self.request, object)
        return object

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response({'detail': 'Comunidade deletada com sucesso!'}, status=status.HTTP_204_NO_CONTENT)  