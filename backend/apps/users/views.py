from django.shortcuts import get_list_or_404, get_object_or_404  
from django.http import Http404 
from django.db import transaction  
from rest_framework.views import APIView  
from rest_framework.response import Response  
from rest_framework import status, permissions  
from . import models, serializers 
from .email.send_email import send_confirmation_email 

"""
    Este arquivo contém as views relacionadas aos usuários, responsáveis por processar as requisições
    HTTP feitas aos endpoints da API.

    As views desempenham as seguintes funções:
    - Criar novos usuários (UserCreateView)
    - Consultar os detalhes do usuario autenticado (UserProfileView)
    - Atualizar informações de um usuário (UserUpdateView)
    - Excluir um usuário (UserDeleteView)

    Cada view gerencia as operações CRUD (Create, Read, Update, Delete) e retorna as respostas em formato JSON.
"""

# View responsável por criar novos usuários na plataforma.
# Usada para criar usuarios, manda um email para a autenticação do email.
class UserCreateView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = serializers.UsersSerializer(data=request.data)

        if serializer.is_valid():
            with transaction.atomic():
                user = serializer.save()
                try:
                    send_confirmation_email(user)
                except Exception as e:
                    return Response({'detail': f'Usuário criado, mas falha ao enviar email: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)

                return Response({'detail': 'Usuário criado com sucesso!'}, status=status.HTTP_201_CREATED)

        # Retorno correto em caso de dados inválidos
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
# View responsável por retornar o perfil do usuário autenticado.
# Deve ser usada para pegar os dados do usuário que esta autenticado.
class UserProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]  # Exige autenticação para acessar a view

    def get(self, request, username):
        try:
            # Recupera o usuário autenticado pelo username ou retorna erro 404 se não existir.
            user = get_object_or_404(models.Users, username=request.user.username)
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
# Deve ser usada para atualizar os dados do usuário.
class UserUpdateView(APIView):
    permission_classes = [permissions.IsAuthenticated]  # Exige autenticação para acessar a view

    def patch(self, request):
        try:
            data = request.data  # Obtém os dados enviados na requisição
            # Recupera o usuário autenticado pelo username ou retorna erro 404 se não existir.
            user = get_object_or_404(models.Users, username=request.user.username)
            serializer = serializers.UsersSerializer(user, data=data, partial=True)

            if serializer.is_valid():
                serializer.save()  # Atualiza os dados do usuário
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
# Deve ser usada para deletar os dados de um usuario
class UserDeleteView(APIView):
    permission_classes = [permissions.IsAuthenticated]  # Exige autenticação para acessar a view

    def delete(self, request):
        try:
            # Recupera o usuário autenticado pelo username ou retorna erro 404 se não existir.
            user = get_object_or_404(models.Users, username=request.user.username)

            # Exclui o usuário do banco de dados.
            user.delete()
            return Response("Usuário excluído com sucesso!!", status=status.HTTP_204_NO_CONTENT)

        except Http404:
            # Retorna erro caso o usuário não seja encontrado.
            return Response('O usuário não foi encontrado!!!', status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            # Tratamento genérico para outros erros.
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)
