from django.shortcuts import get_list_or_404, get_object_or_404  
from django.http import Http404  
from rest_framework.views import APIView  
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
    - PostListView        → Lista todos os posts de uma thread.  
    - PostCreateView      → Cria um novo post.  
    - PostUpdateView      → Atualiza parcialmente um post.  
    - PostDeleteView      → Deleta um post.  
"""

class ThreadListView(APIView):  
    """ Retorna uma lista com todas as threads cadastradas. """  
    permission_classes = [permissions.AllowAny]  

    def get(self, request):  
        try:  
            threads = get_list_or_404(models.Thread)  
            serializer = serializers.ThreadsSerializer(threads, many=True)  
            return Response(serializer.data, status=status.HTTP_200_OK)  
        except Http404:  
            return Response({'detail': 'Não há Threads cadastradas'}, status=status.HTTP_404_NOT_FOUND)  
        except Exception as e:  
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)  


class ThreadCreateView(APIView):  
    """ Cria uma nova thread. Apenas usuários autenticados podem acessar. """  
    permission_classes = [permissions.IsAuthenticated]  

    def post(self, request):  
        data = request.data  
        if not data:  
            return Response({'detail': 'Nenhum dado foi enviado!'}, status=status.HTTP_400_BAD_REQUEST)  

        try:  
            serializer = serializers.ThreadsSerializer(data=data)  
            if serializer.is_valid():  
                serializer.save()  
                return Response({'detail': 'Thread criada com sucesso!'}, status=status.HTTP_201_CREATED)  
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)  
        except Exception as e:  
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)  


class ThreadUpdateView(APIView):  
    """ Atualiza parcialmente uma thread. Apenas o dono da thread pode modificar. """  
    permission_classes = [IsPostOwner]  

    def patch(self, request, slug):  
        data = request.data  
        if not data:  
            return Response({'detail': 'Nenhum dado foi enviado!'}, status=status.HTTP_400_BAD_REQUEST)  

        try:  
            thread = get_object_or_404(models.Thread, slug=slug)  
            serializer = serializers.ThreadsSerializer(thread, data=data, partial=True)  
            if serializer.is_valid():  
                serializer.save()  
                return Response({'detail': 'Thread atualizada com sucesso!'}, status=status.HTTP_200_OK)  
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)  
        except Http404:  
            return Response({'detail': 'Thread não encontrada!'}, status=status.HTTP_404_NOT_FOUND)  
        except Exception as e:  
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)  


class ThreadDeleteView(APIView):  
    """ Deleta uma thread. Apenas o dono da thread pode excluir. """  
    permission_classes = [IsPostOwner]  

    def delete(self, request, slug):  
        try:  
            thread = get_object_or_404(models.Thread, slug=slug)  
            thread.delete()  
            return Response({'detail': 'Thread deletada com sucesso!'}, status=status.HTTP_204_NO_CONTENT)  
        except Http404:  
            return Response({'detail': 'Thread não encontrada!'}, status=status.HTTP_404_NOT_FOUND)  
        except Exception as e:  
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)  


class ThreadDetailView(APIView):  
    """ Retorna detalhes de uma thread específica. """  
    permission_classes = [permissions.AllowAny]  

    def get(self, request, slug):  
        try:  
            thread = get_object_or_404(models.Thread, slug=slug)  
            serializer = serializers.ThreadsSerializer(thread)  
            return Response(serializer.data, status=status.HTTP_200_OK)  
        except Http404:  
            return Response({'detail': 'Thread não encontrada!'}, status=status.HTTP_404_NOT_FOUND)  
        except Exception as e:  
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)  


class PostListView(APIView):  
    """ Retorna uma lista de todos os posts dentro de uma thread específica. """  
    permission_classes = [permissions.AllowAny]  

    def get(self, request, slug):  
        try:  
            posts = get_list_or_404(models.Post, thread__slug=slug, parent_post__isnull=True)  
            serializer = serializers.PostsSerializer(posts, many=True)  
            return Response(serializer.data, status=status.HTTP_200_OK)  
        except Http404:  
            return Response({'detail': 'Não há Posts nessa thread!'}, status=status.HTTP_404_NOT_FOUND)  
        except Exception as e:  
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)  


class PostCreateView(APIView):  
    """ Cria um novo post dentro de uma thread. Apenas usuários autenticados podem postar. """  
    permission_classes = [permissions.IsAuthenticated]  

    def post(self, request):  
        data = request.data  
        if not data:  
            return Response({'detail': 'Nenhum dado foi enviado!'}, status=status.HTTP_400_BAD_REQUEST)  

        try:  
            serializer = serializers.PostsSerializer(data=data)  
            if serializer.is_valid():  
                serializer.save()  
                return Response({'detail': 'Post criado com sucesso!'}, status=status.HTTP_201_CREATED)  
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)  
        except Exception as e:  
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)  


class PostUpdateView(APIView):  
    """ Atualiza parcialmente um post. Apenas o dono do post pode modificar. """  
    permission_classes = [IsPostOwner]  

    def patch(self, request, id_post):  
        data = request.data  
        if not data:  
            return Response({'detail': 'Nenhum dado foi enviado!'}, status=status.HTTP_400_BAD_REQUEST)  

        try:  
            post = get_object_or_404(models.Post, id=id_post)  
            serializer = serializers.PostsSerializer(post, data=data, partial=True)  
            if serializer.is_valid():  
                serializer.save()  
                return Response(serializer.data, status=status.HTTP_200_OK)  
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)  
        except Http404:  
            return Response({'detail': 'Post não encontrado!'}, status=status.HTTP_404_NOT_FOUND)  
        except Exception as e:  
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)  


class PostDeleteView(APIView):  
    """ Deleta um post. Apenas o dono do post pode excluir. """  
    permission_classes = [IsPostOwner]  

    def delete(self, request, id_post):  
        try:  
            post = get_object_or_404(models.Post, id=id_post)  
            post.delete()  
            return Response({'detail': 'Post deletado com sucesso!'}, status=status.HTTP_204_NO_CONTENT)  
        except Http404:  
            return Response({'detail': 'Post não encontrado!'}, status=status.HTTP_404_NOT_FOUND)  
        except Exception as e:  
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)  
