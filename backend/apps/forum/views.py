from django.shortcuts import get_list_or_404, get_object_or_404  
from django.http import Http404  
from rest_framework.generics import GenericAPIView
from rest_framework.mixins import ( RetrieveModelMixin, ListModelMixin, CreateModelMixin, UpdateModelMixin, DestroyModelMixin)
from rest_framework.response import Response  
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
        try: 
            threads = get_list_or_404(models.Thread)
            return threads  
        except Http404:  
            return Response({'detail': 'Não há Threads cadastradas'}, status=status.HTTP_404_NOT_FOUND)  

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True, context = {'request': request})
        return Response(serializer.data)
    
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
        instance = get_object_or_404(models.Thread, slug=slug)
        self.check_object_permissions(self.request, instance)
        return instance
        
    def partial_update(self, request, *args, **kwargs):
            try:
                instance = self.get_object()
            except Http404:  
                return Response({'detail': 'Thread não encontrada!'}, status=status.HTTP_404_NOT_FOUND) 
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
            thread = get_object_or_404(models.Thread, slug=slug)
        except Http404:  
            return Response({'detail': 'Thread não encontrada!'}, status=status.HTTP_404_NOT_FOUND) 
        
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
        instance = get_object_or_404(models.Thread, slug=slug)
        self.check_object_permissions(self.request, instance)
        return instance

    def destroy(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
        except Http404:
            return Response({'detail': 'Thread não encontrada!'}, status=status.HTTP_404_NOT_FOUND)
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
        instance = get_object_or_404(models.Thread, slug=slug)
        return instance  
        
    def retrieve(self, request, *args, **kwargs):
        try:  
            instance = self.get_object()
        except Http404:  
            return Response('A Bolha não foi encontrada', status=status.HTTP_404_NOT_FOUND) 
        
        serializer = self.get_serializer(instance)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
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
        instance = get_object_or_404(models.Post, id=id_post)
        self.check_object_permissions(self.request, instance)
        return instance
        
    def partial_update(self, request, *args, **kwargs):
            try: 
                instance = self.get_object()
            except Http404:  
                return Response({'detail': 'Post não encontrado!'}, status=status.HTTP_404_NOT_FOUND) 
            
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
        instance = get_object_or_404(models.Post, id=id_post)
        self.check_object_permissions(self.request, instance)
        return instance

    def destroy(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
        except Http404:
            return Response({'detail': 'Post não encontrado!'}, status=status.HTTP_404_NOT_FOUND)

        self.perform_destroy(instance)
        return Response({'detail': 'Post deletado com sucesso!'}, status=status.HTTP_204_NO_CONTENT)  
    
    def delete(self, request, *args, **kwargs):  
        return self.destroy(request,  *args, **kwargs)