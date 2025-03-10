from django.shortcuts import get_list_or_404, get_object_or_404
from django.http import Http404
from rest_framework_simplejwt.tokens import RefreshToken
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
        
class UserCreateView(APIView):
    def post(self, request):
        try:
            data = request.data
            serializer = serializers.UsersSerializer(data = data)
            
            if serializer.is_valid():
                user = serializer.save()

                refresh = RefreshToken.for_user(user)
                access_token = str(refresh.access_token)

                response = Response({'detail': 'Usuario criado com sucesso!!!', 'user': serializer.data}, status=status.HTTP_201_CREATED)
                
                response.set_cookie(
                    key='access_token',
                    value=access_token,
                    secure=True,
                    httponly=True,
                    samesite='None',
                    max_age=300
                )

                response.set_cookie(
                    key='refresh_token',
                    value=str(refresh),
                    secure=True,
                    httponly=True,
                    samesite='None',
                    max_age=86400
                )

                return response
            
            return Response(serializer.errors, status = status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status = status.HTTP_400_BAD_REQUEST)


class UserDetailView(APIView):
    def get(self, request, username):
        try:
            user = get_object_or_404(models.Users, username = username)
            serializer = serializers.UsersSerializer(user)

            return Response(serializer.data, status = status.HTTP_200_OK)
        except Http404:
            return Response('O usuario não foi encontrado!!!', status = status.HTTP_404_NOT_FOUND)
        except:
            return Response("ERROR", status = status.HTTP_400_BAD_REQUEST)

    def patch(self, request, username):
        try:
            data = request.data
            user = get_object_or_404(models.Users, username = username)
            serializer = serializers.UsersSerializer(user, data = data, partial = True)
            if serializer.is_valid():
                serializer.save()
                return Response("Dados atualizados com sucesso!!", status = status.HTTP_200_OK)

            print(serializer.errors)
            return Response(serializer.errors, status = status.HTTP_400_BAD_REQUEST)
        except Http404:
            return Response('O usuario não foi encontrado!!!', status = status.HTTP_404_NOT_FOUND)
        except:
            return Response("ERROR", status = status.HTTP_400_BAD_REQUEST)

    def delete(self, request, username):
        try:
            user = get_object_or_404(models.Users, username = username)

            user.delete()
            return Response("Dados excluidos com sucesso!!", status = status.HTTP_204_NO_CONTENT)
        
        except Http404:
            return Response('O usuario não foi encontrado!!!', status = status.HTTP_404_NOT_FOUND)
        except:
            return Response("ERROR", status = status.HTTP_400_BAD_REQUEST)