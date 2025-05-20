from rest_framework.generics import GenericAPIView
from rest_framework.mixins import ( CreateModelMixin, UpdateModelMixin, DestroyModelMixin)
from rest_framework.response import Response  
from rest_framework.exceptions import NotFound
from rest_framework import status, permissions  
from apps.users.auth.permissions import IsPostOwner
from apps.community.models.threads import *
from apps.community.serializers.threads import *

class PostCreateView(GenericAPIView, CreateModelMixin):  
    """ Cria um novo post dentro de uma thread. Apenas usuários autenticados podem postar. """  
    permission_classes = [permissions.IsAuthenticated]  
    serializer_class = PostsSerializer

    def create(self, request, *args, **kwargs):
        data = request.data.copy()

        data['author'] = self.request.user.pk
        data['thread'] = self.kwargs.get('thread_slug')

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response({'detail': 'Post criado com sucesso!'}, status=status.HTTP_201_CREATED)

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)

class PostUpdateView(GenericAPIView, UpdateModelMixin):  
    """ Atualiza parcialmente um post. Apenas o dono do post pode modificar. """  
    permission_classes = [IsPostOwner]  
    serializer_class = PostsSerializer

    def get_object(self):
        id_post = self.kwargs.get('id_post')
        try:
            queryset = Post.objects.select_related('author', 'thread').get(id = id_post)
            self.check_object_permissions(self.request, queryset)
            return queryset
        except Post.DoesNotExist:
            raise NotFound("Post não encontrado!")
        
    def partial_update(self, request, *args, **kwargs):
            instance = self.get_object()
            serializer = self.get_serializer(instance, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)

            if getattr(instance, '_prefetched_objects_cache', None):
                instance._prefetched_objects_cache = {}

            return Response({'detail': 'Post atualizado com sucesso!'}, status=status.HTTP_200_OK)  
    
    def patch(self, request, *args, **kwargs):  
        return self.partial_update(request,  *args, **kwargs)

class PostDeleteView(GenericAPIView, DestroyModelMixin):  
    """ Deleta um post. Apenas o dono do post pode excluir. """  
    permission_classes = [IsPostOwner]  
    serializer_class = PostsSerializer

    def get_object(self):
        id_post = self.kwargs.get('id_post')
        try:
            queryset = Post.objects.get(id = id_post)
            self.check_object_permissions(self.request, queryset)
            return queryset
        except Post.DoesNotExist:
            raise NotFound("Post não encontrado!")

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response({'detail': 'Post deletado com sucesso!'}, status=status.HTTP_204_NO_CONTENT)  
    
    def delete(self, request, *args, **kwargs):  
        return self.destroy(request,  *args, **kwargs)