from django.shortcuts import get_list_or_404, get_object_or_404
from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from . import models, serializers

"""
    Arquivo responsável pela lógica por trás de cada requisição HTTP, retornando a resposta adequada.

    Este arquivo contém as views de 'Users', que processam as requisições feitas aos endpoints
    específicos da API. As views gerenciam a interação entre a aplicação e o usuário, manipulando dados e retornando 
    as respostas no formato apropriado, como JSON, para as requisições da API.
"""

class UserView(APIView):
    def get(self, request):
        try:
            users = get_list_or_404(models.Users)
            serializer = serializers.UsersSerializer(users, many = True)

            return Response(serializer.data, status = status.HTTP_200_OK)
        except Http404:
            return Response('Nenhum usuário encontrado', status = status.HTTP_204_NO_CONTENT)
        except:
            return Response("ERROR", status = status.HTTP_400_BAD_REQUEST)
  

    def post(self, request):
        try:
            data = request.data
            serializer = serializers.UsersSerializerPost(data = data)
            
            if serializer.is_valid():
                serializer.save()
                return Response({'detail': 'Usuario criado com sucesso!!!'}, status=status.HTTP_201_CREATED)
            
            print(serializer.errors)
            return Response(serializer.errors, status = status.HTTP_400_BAD_REQUEST)
        except:
            return Response("ERROR", status = status.HTTP_400_BAD_REQUEST)


class UserDetailView(APIView):
    def get(self, request, username):
        ...

    def patch(self, request, username):
        ...

    def delete(self, request, username):
        ...