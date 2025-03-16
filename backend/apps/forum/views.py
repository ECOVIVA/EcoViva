from django.shortcuts import get_list_or_404,get_object_or_404
from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions

from apps.users.auth.permissions import IsPostOwner
from . import models, serializers

"""
    Arquivo responsável pela lógica por trás de cada requisição HTTP, retornando a resposta adequada.

    Este arquivo contém as views de 'Posts', que processam as requisições feitas aos endpoints
    específicos da API. As views gerenciam a interação entre a aplicação e o usuário, manipulando dados e retornando 
    as respostas no formato apropriado, como JSON, para as requisições da API.
"""

class ThreadListView(APIView):
    permission_classes = [permissions.AllowAny]
    def get(self, request):
        try:
            thread = get_list_or_404(models.Thread)
            serializer = serializers.ThreadsSerializer(thread, many = True)

            return Response(serializer.data, status= status.HTTP_200_OK)
        except Http404:
            return Response({'detail': 'Não há Thrends cadastradas'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class ThreadCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def post(self, request):
        data = request.data

        if not data:
            return Response('Nenhum dado foi enviado!!', status = status.HTTP_400_BAD_REQUEST)
        
        try:
            serializer = serializers.ThreadsSerializer(data = data)
            if serializer.is_valid():
                serializer.save()
                return Response("Thread criada com sucesso!!!", status=status.HTTP_201_CREATED)
            
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'detail': str(e) }, status=status.HTTP_400_BAD_REQUEST)
        
class ThreadUpdateView(APIView):
    permission_classes = [IsPostOwner]

    def patch(self, request, slug):
        data = request.data

        if not data:
            return Response('Nenhum dado foi enviado!!', status = status.HTTP_400_BAD_REQUEST)
        
        try:
            thread = get_object_or_404(models.Thread, slug = slug)
            serializer = serializers.ThreadsSerializer(thread ,data = data, partial = True)

            if serializer.is_valid():
                serializer.save()
                return Response("Thread criada com sucesso!!!", status=status.HTTP_200_OK)
            
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Http404:
            return Response({'detail': 'Thrend não encontrada!!'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'detail': str(e) }, status=status.HTTP_400_BAD_REQUEST)
        
class ThreadDeleteView(APIView):
    permission_classes = [IsPostOwner]

    def delete(self, request, slug):
        try:
            thread = get_object_or_404(models.Thread, slug = slug)
            thread.delete()

            return Response({'detail': 'Thread deletada com sucesso!!'}, status=status.HTTP_204_NO_CONTENT)
        except Http404:
            return Response({'detail': 'A Thread não foi encontrado!!'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
class ThreadDetailView(APIView):
    permission_classes = [permissions.AllowAny]
    def get(self, request, slug):
        try:
            thread = get_object_or_404(models.Thread, slug = slug)
            serializer = serializers.ThreadsSerializer(thread)

            return Response(serializer.data, status= status.HTTP_200_OK)
        except Http404:
            return Response({'error': 'Thrend não encontrada!!'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class PostListView(APIView):
    permission_classes = [permissions.AllowAny]
    def get(self, request, slug):
        try:
            posts = get_list_or_404(models.Post, thread__slug = slug, parent_post__isnull=True)
            serializer = serializers.PostsSerializer(posts, many = True)

            return Response(serializer.data, status= status.HTTP_200_OK)
        except Http404:
            return Response({'detail': 'Não há Posts nessa thread!!'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class PostCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def post(self, request):
        data = request.data

        if not data:
            return Response('Nenhum dado foi enviado!!', status = status.HTTP_400_BAD_REQUEST)
        
        try:
            serializer = serializers.PostsSerializer(data = data)
            if serializer.is_valid():
                serializer.save()
                return Response("Post criado com sucesso!!!")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'detail': str(e) }, status=status.HTTP_400_BAD_REQUEST)

class PostUpdateView(APIView):
    permission_classes = [IsPostOwner]
    def patch(self, request, id_post):
        data = request.data

        if not data:
            return Response('Nenhum dado foi enviado!', status= status.HTTP_400_BAD_REQUEST)
        
        try:
            post = get_object_or_404(models.Post, id = id_post)
            serializer = serializers.PostsSerializer(post, data = data, partial = True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status= status.HTTP_200_OK)
            return Response(serializer.errors, status= status.HTTP_400_BAD_REQUEST)
        except Http404:
            return Response({'detail': 'O Post não foi encontrado!!'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class PostDeleteView(APIView):
    permission_classes = [IsPostOwner]
    def delete(self, request, id_post):
        try:
            post = get_object_or_404(models.Post, id = id_post)
            post.delete()

            return Response({'detail': 'Post deletado com sucesso!!'}, status=status.HTTP_204_NO_CONTENT)
        except Http404:
            return Response({'detail': 'O Post não foi encontrado!!'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)