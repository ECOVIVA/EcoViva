from rest_framework.generics import GenericAPIView
from rest_framework.mixins import ( RetrieveModelMixin, CreateModelMixin, UpdateModelMixin, DestroyModelMixin)
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
class UserCreateView(GenericAPIView, CreateModelMixin):
    permission_classes = [permissions.AllowAny]
    serializer_class = serializers.UsersSerializer

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response({'detail': 'Usuário criado com sucesso!'}, status=status.HTTP_201_CREATED)
    
    def perform_create(self, serializer):
        user = serializer.save()
        try:
            send_confirmation_email(user)
        except Exception as e:
            return Response({'detail': f'Usuário criado, mas falha ao enviar email: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)
    
# View responsável por retornar o perfil do usuário autenticado.
# Deve ser usada para pegar os dados do usuário que esta autenticado.
class UserProfileView(GenericAPIView, RetrieveModelMixin):
    permission_classes = [permissions.IsAuthenticated]  # Exige autenticação para acessar a view
    serializer_class = serializers.UsersSerializer

    def get_object(self):
        return self.request.user
    
    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)
    
# View responsável por atualizar parcialmente os dados de um usuário específico.
# Apenas usuários autenticados podem acessar essa rota.
# Deve ser usada para atualizar os dados do usuário.
class UserUpdateView(GenericAPIView, UpdateModelMixin):
    permission_classes = [permissions.IsAuthenticated]  # Exige autenticação para acessar a view
    serializer_class = serializers.UsersSerializer

    def get_object(self):
        return self.request.user
    
    def patch(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)
    
    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response("Dados atualizados com sucesso!!", status=status.HTTP_200_OK)

# View responsável por excluir um usuário específico.
# Apenas usuários autenticados podem acessar essa rota.
# Deve ser usada para deletar os dados de um usuario
class UserDeleteView(GenericAPIView, DestroyModelMixin):
    permission_classes = [permissions.IsAuthenticated]  # Exige autenticação para acessar a view
    serializer_class = serializers.UsersSerializer

    def get_object(self):
        return self.request.user
    
    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response("Usuário excluído com sucesso!!", status=status.HTTP_204_NO_CONTENT)