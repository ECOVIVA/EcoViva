from django.db.models import Count
from rest_framework.generics import GenericAPIView
from rest_framework.mixins import ( RetrieveModelMixin, ListModelMixin, CreateModelMixin, UpdateModelMixin, DestroyModelMixin)
from rest_framework.response import Response  
from rest_framework.exceptions import NotFound
from rest_framework import status, permissions  

from apps.users.auth.permissions import IsPostOwner  
from . import models, serializers  

"""
    Este módulo define as views responsáveis por processar as requisições HTTP da API de 'Threads' e 'Posts'.  
    Cada classe manipula operações específicas sobre threads e posts, interagindo com os modelos e retornando  
    as respostas apropriadas para as APIs.

    - ThreadListView       → Lista todas as threads cadastradas.  
    - ThreadCreateView     → Cria uma nova thread.  
    - ThreadUpdateView     → Atualiza parcialmente uma thread.  
    - ThreadDeleteView     → Deleta uma thread.  
    - ThreadDetailView     → Retorna detalhes de uma thread específica.  
    - PostCreateView      → Cria um novo post.  
    - PostUpdateView      → Atualiza parcialmente um post.  
    - PostDeleteView      → Deleta um post.  
"""

class ThreadListView(GenericAPIView, ListModelMixin):  
    """ Retorna uma lista com todas as threads cadastradas. """  
    permission_classes = [permissions.IsAuthenticated]  
    serializer_class = serializers.ThreadReadSerializer

    def get_queryset(self):
        queryset = models.Thread.objects.select_related('author').prefetch_related('likes', 'tags')
        if not queryset.exists():
            raise NotFound("Thread não encontrada!")
        return queryset
    
    def get(self, request, *args, **kwargs):  
        return self.list(request, *args, **kwargs)

class ThreadCreateView(GenericAPIView, CreateModelMixin):  
    """ Cria uma nova thread. Apenas usuários autenticados podem acessar. """  
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = serializers.ThreadWriteSerializer  

    def create(self, request, *args, **kwargs):
        data = request.data.copy()  

        data["author"] = request.user.pk

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response({'detail': 'Thread criada com sucesso!'}, status=status.HTTP_201_CREATED)
    
    def post(self, request):  
        return self.create(request)

class ThreadUpdateView(GenericAPIView, UpdateModelMixin):  
    """ Atualiza parcialmente uma thread. Apenas o dono da thread pode modificar. """  
    permission_classes = [IsPostOwner]  
    serializer_class = serializers.ThreadWriteSerializer

    def get_object(self):
        slug = self.kwargs.get('slug')
        try:
            queryset = models.Thread.objects.get(slug = slug)
            self.check_object_permissions(self.request, queryset)
            return queryset
        except models.Thread.DoesNotExist:
            raise NotFound("Thread não encontrada!")
        
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
    
class ThreadLikeView(GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, slug):     
        try:
            thread = models.Thread.objects.get(slug = slug)
        except models.Thread.DoesNotExist:
            raise NotFound("Thread não encontrada!")
        
        user = request.user

        if thread.likes.filter(id=user.id).exists():
            thread.likes.remove(user)
            return Response({'liked': False}, status=status.HTTP_200_OK)
        else:
            thread.likes.add(user)
            return Response({'liked': True}, status=status.HTTP_200_OK)

class ThreadDeleteView(GenericAPIView, DestroyModelMixin):  
    """ Deleta uma thread. Apenas o dono da thread pode excluir. """  
    permission_classes = [IsPostOwner]  

    def get_object(self):
        slug = self.kwargs.get('slug')
        try:
            queryset = models.Thread.objects.get(slug = slug)
            self.check_object_permissions(self.request, queryset)
            return queryset
        except models.Thread.DoesNotExist:
            raise NotFound("Thread não encontrada!")

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response({'detail': 'Thread deletada com sucesso!'}, status=status.HTTP_204_NO_CONTENT)  
    
    def delete(self, request, *args, **kwargs):  
        return self.destroy(request,  *args, **kwargs) 

class ThreadDetailView(GenericAPIView, RetrieveModelMixin):  
    """ Retorna detalhes de uma thread específica. """  
    permission_classes = [permissions.AllowAny]  
    serializer_class = serializers.ThreadReadSerializer

    def get_object(self):
        slug = self.kwargs.get('slug')
        try:
            return models.Thread.objects.select_related('author').prefetch_related('likes', 'tags', 'posts', 'posts__author').annotate(likes_count=Count('likes')).get(slug = slug)
        except models.Thread.DoesNotExist:
            raise NotFound("Thread não encontrada!")
    
    def get(self, request, *args, **kwargs):  
        return self.retrieve(request, *args, **kwargs)

class PostCreateView(GenericAPIView, CreateModelMixin):  
    """ Cria um novo post dentro de uma thread. Apenas usuários autenticados podem postar. """  
    permission_classes = [permissions.IsAuthenticated]  
    serializer_class = serializers.PostsSerializer

    def create(self, request, *args, **kwargs):
        data = request.data.copy()

        data['author'] = self.request.user.pk
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response({'detail': 'Post criado com sucesso!'}, status=status.HTTP_201_CREATED)

    def post(self, request):  
        return self.create(request)

class PostUpdateView(GenericAPIView, UpdateModelMixin):  
    """ Atualiza parcialmente um post. Apenas o dono do post pode modificar. """  
    permission_classes = [IsPostOwner]  
    serializer_class = serializers.PostsSerializer

    def get_object(self):
        id_post = self.kwargs.get('id_post')
        try:
            queryset = models.Post.objects.select_related('author', 'thread').get(id = id_post)
            self.check_object_permissions(self.request, queryset)
            return queryset
        except models.Post.DoesNotExist:
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
    serializer_class = serializers.PostsSerializer

    def get_object(self):
        id_post = self.kwargs.get('id_post')
        try:
            queryset = models.Post.objects.get(id = id_post)
            self.check_object_permissions(self.request, queryset)
            return queryset
        except models.Post.DoesNotExist:
            raise NotFound("Post não encontrado!")

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response({'detail': 'Post deletado com sucesso!'}, status=status.HTTP_204_NO_CONTENT)  
    
    def delete(self, request, *args, **kwargs):  
        return self.destroy(request,  *args, **kwargs)