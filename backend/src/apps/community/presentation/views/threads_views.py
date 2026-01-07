from rest_framework.generics import ListAPIView, RetrieveAPIView, CreateAPIView, UpdateAPIView, DestroyAPIView
from rest_framework.response import Response  
from rest_framework import status  

from apps.users.auth.permissions import IsPostOwner, IsCommunityMember
from apps.community.models.community import Community
from apps.community.serializers.threads import ThreadReadSerializer, ThreadWriteSerializer
from utils.mixins.community_mixins import ThreadViewMixin

class ThreadListView(ThreadViewMixin,ListAPIView):  
    """ Retorna uma lista com todas as threads cadastradas. """  
    permission_classes = [IsCommunityMember]  
    serializer_class = ThreadReadSerializer

    def get_queryset(self):
        community_slug = self.kwargs.get('slug')
        queryset = self.get_thread_list(community_slug)
        self.check_object_permissions(self.request, queryset.first().community)
        return queryset
    
    def get(self, request, *args, **kwargs):  
        return self.list(request, *args, **kwargs)

class ThreadCreateView(ThreadViewMixin,CreateAPIView):  
    """ Cria uma nova thread. Apenas usuários autenticados podem acessar. """  
    permission_classes = [IsCommunityMember]
    serializer_class = ThreadWriteSerializer  

    def create(self, request, *args, **kwargs):
        community_slug = self.kwargs.get('slug')
        data = request.data.copy()  

        data["author"] = request.user.pk
        data['community'] = community_slug

        self.check_object_permissions(self.request, self.get_community_object(community_slug))

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response({'detail': 'Thread criada com sucesso!'}, status=status.HTTP_201_CREATED)
    
    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)

class ThreadUpdateView(ThreadViewMixin, UpdateAPIView):  
    """ Atualiza parcialmente uma thread. Apenas o dono da thread pode modificar. """  
    permission_classes = [IsPostOwner]  
    serializer_class = ThreadWriteSerializer

    def get_object(self):
        thread_slug = self.kwargs.get('thread_slug')
        object = self.get_thread_object(thread_slug)
        self.check_object_permissions(self.request, object)
        return object
        
    def partial_update(self, request, *args, **kwargs):
            instance = self.get_object()
            serializer = self.get_serializer(instance, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)

            if getattr(instance, '_prefetched_objects_cache', None):
                instance._prefetched_objects_cache = {}

            return Response({'detail': 'Thread atualizada com sucesso!'}, status=status.HTTP_200_OK)  
    
    def patch(self, request, *args, **kwargs):  
        return self.partial_update(request,  *args, **kwargs)
    
class ThreadLikeView(ThreadViewMixin, CreateAPIView):
    permission_classes = [IsCommunityMember]

    def post(self, request):  
        thread_slug = self.kwargs.get('thread_slug')   
        thread = self.get_thread_object(thread_slug)
        
        user = self.request.user

        if thread.likes.filter(id=user.id).exists():
            thread.likes.remove(user)
            return Response({'liked': False}, status=status.HTTP_200_OK)
        else:
            thread.likes.add(user)
            return Response({'liked': True}, status=status.HTTP_200_OK)

class ThreadDeleteView(ThreadViewMixin, DestroyAPIView):  
    """ Deleta uma thread. Apenas o dono da thread pode excluir. """  
    permission_classes = [IsPostOwner]  

    def get_object(self):
        thread_slug = self.kwargs.get('thread_slug')
        object = self.get_thread_object(thread_slug)
        self.check_object_permissions(self.request, object)
        return object

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response({'detail': 'Thread deletada com sucesso!'}, status=status.HTTP_204_NO_CONTENT)  
    
    def delete(self, request, *args, **kwargs):  
        return self.destroy(request,  *args, **kwargs) 

class ThreadDetailView(ThreadViewMixin, RetrieveAPIView):  
    """ Retorna detalhes de uma thread específica. """  
    permission_classes = [IsCommunityMember]  
    serializer_class = ThreadReadSerializer

    def get_object(self):
        thread_slug = self.kwargs.get('thread_slug')
        object = self.get_thread_object(thread_slug)
        self.check_object_permissions(self.request, object.community)
        return object
    
    def get(self, request, *args, **kwargs):  
        return self.retrieve(request, *args, **kwargs)