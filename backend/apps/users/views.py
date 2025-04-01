from django.shortcuts import get_list_or_404, get_object_or_404
from django.http import Http404
from django.db import transaction
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from . import models, serializers
from .email.send_email import send_confirmation_email
from apps.users.auth import permissions as permissions_news

"""
    Este arquivo contém as views relacionadas aos usuários, responsáveis por processar as requisições
    HTTP feitas aos endpoints da API.

    As views desempenham as seguintes funções:
    - Listar todos os usuários (UserListView)
    - Criar novos usuários (UserCreateView)
    - Consultar os detalhes de um usuário específico (UserDetailView)
    - Atualizar informações de um usuário (UserUpdateView)
    - Excluir um usuário (UserDeleteView)

    Cada view gerencia as operações CRUD (Create, Read, Update, Delete) e retorna as respostas em formato JSON.
"""

# View responsável por listar todos os usuários cadastrados.
# Pode ser utilizada para implementar um sistema de busca de perfis.
class UserListView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        try:
            # Recupera todos os usuários ou retorna erro 404 se não houver nenhum registro.
            users = get_list_or_404(models.Users)
            serializer = serializers.UsersSerializer(users, many=True)

            return Response(serializer.data, status=status.HTTP_200_OK)
        except Http404:
            # Retorna mensagem indicando ausência de usuários cadastrados.
            return Response('Nenhum usuário encontrado', status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            # Tratamento genérico para outros erros.
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

# View responsável por criar novos usuários na plataforma.
# Após a criação do usuário, gera e armazena os tokens de autenticação (access e refresh) nos cookies.
class UserCreateView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        try:
            data = request.data
            serializer = serializers.UsersSerializer(data=data)

            if serializer.is_valid():
                with transaction.atomic():
                    user = serializer.save()
                    try:
                        send_confirmation_email(user)
                    except Exception as e:
                        response = Response(
                        {'detail': str(e)},
                        status=status.HTTP_400_BAD_REQUEST
                    )

                    response = Response(
                        {'detail': 'Usuário criado com sucesso!!!'},
                        status=status.HTTP_201_CREATED
                    )

                    return response

                # Retorna erros de validação do serializer.
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            # Retorna uma mensagem de erro detalhada em caso de falha.
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

# View responsável por retornar os detalhes de um usuário específico, identificado pelo username.
class UserDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, username):
        try:
            # Recupera o usuário pelo username ou retorna erro 404 se não existir.
            user = get_object_or_404(models.Users, username=username)
            serializer = serializers.UsersSerializer(user)

            # Retorna os dados do usuário.
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Http404:
            # Retorna erro caso o usuário não seja encontrado.
            return Response('O usuário não foi encontrado!!!', status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            # Tratamento genérico para outros erros.
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

# View responsável por atualizar parcialmente os dados de um usuário específico.
# Apenas usuários autenticados podem acessar essa rota.
class UserUpdateView(APIView):
    permission_classes = [permissions_news.IsUserAuthenticated]

    def patch(self, request, username):
        try:
            data = request.data
            # Recupera o usuário pelo username ou retorna erro 404 se não existir.
            user = get_object_or_404(models.Users, username=username)
            serializer = serializers.UsersSerializer(user, data=data, partial=True)

            if serializer.is_valid():
                serializer.save()
                return Response("Dados atualizados com sucesso!!", status=status.HTTP_200_OK)

            # Retorna erros de validação caso o serializer não seja válido.
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Http404 as e:
            # Retorna erro caso o usuário não seja encontrado.
            return Response({'detail': str(e)}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            # Tratamento genérico para outros erros.
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

# View responsável por excluir um usuário específico.
# Apenas usuários autenticados podem acessar essa rota.
class UserDeleteView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, username):
        try:
            # Recupera o usuário pelo username ou retorna erro 404 se não existir.
            user = get_object_or_404(models.Users, username=username)

            # Exclui o usuário do banco de dados.
            user.delete()
            return Response("Usuário excluído com sucesso!!", status=status.HTTP_204_NO_CONTENT)

        except Http404:
            # Retorna erro caso o usuário não seja encontrado.
            return Response('O usuário não foi encontrado!!!', status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            # Tratamento genérico para outros erros.
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)
