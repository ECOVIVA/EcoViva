from django.shortcuts import get_list_or_404, get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework.exceptions import NotFound

from apps.bolha import models, serializers
from apps.usuarios.auth.permissions import IsOwnerOrReadOnly, IsOwner

"""
    Arquivo responsável pela lógica por trás de cada requisição HTTP, retornando a resposta adequada.

    Este arquivo contém as views da aplicação 'Bubble', que processam as requisições feitas aos endpoints
    específicos da API. As views gerenciam a interação entre a aplicação e o usuário, manipulando dados e retornando 
    as respostas no formato apropriado, como JSON, para as requisições da API.
"""

class BubbleView(APIView):
    permission_classes = [permissions.AllowAny]
    def get(self, request, username):
        try:
            bubble = get_object_or_404(models.Bubble, user__username = username)
            serializer = serializers.BubbleSerializer(bubble)

            return Response(serializer.data, status=status.HTTP_200_OK)
        except NotFound:
            return Response('A Bolha não foi encontrada', status = status.HTTP_404_NOT_FOUND)


class CheckInView(APIView):
    permission_classes = [IsOwnerOrReadOnly]

    def get(self, request,username):
        try:
            bubble = get_object_or_404(models.Bubble, user__username = username)
        except NotFound:
            return Response('A Bolha não foi encontrada', status = status.HTTP_404_NOT_FOUND)
        
        try:
            check_in = get_list_or_404(models.CheckIn, bubble = bubble.pk)
            serializer = serializers.CheckInSerializer(check_in, many = True)

            return Response(serializer.data, status=status.HTTP_200_OK)
        except NotFound:
            return Response('Não há check-ins registrados nessa bolha.', status = status.HTTP_404_NOT_FOUND)

    def post(self, request, username):
        try:
            bubble = get_object_or_404(models.Bubble, user__username = username)
        except NotFound:
            return Response('A Bolha não foi encontrada', status = status.HTTP_404_NOT_FOUND)
        
        data = request.data
        data['bubble'] = bubble.id
        serializer = serializers.CheckInSerializer(data = data)

        if serializer.is_valid():
            serializer.save()
            return Response("Check-in criado com sucesso!!", status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status = status.HTTP_400_BAD_REQUEST)

class CheckInDetailView(APIView):
    permission_classes = [IsOwner]

    def get(self,request, username, checkin_id):
        try:
            bubble = get_object_or_404(models.Bubble, user__username = username)
        except NotFound:
            return Response('A Bolha não foi encontrada', status = status.HTTP_404_NOT_FOUND)
        
        try:
            check_in = get_object_or_404(models.CheckIn, bubble = bubble.pk, id = checkin_id)
            serializer = serializers.CheckInSerializer(check_in)

            return Response(serializer.data, status=status.HTTP_200_OK)
        except NotFound:
            return Response('Este Check-In não existe', status = status.HTTP_404_NOT_FOUND)

    def patch(self, request, username, checkin_id):
        try:
            bubble = get_object_or_404(models.Bubble, user__username = username)
        except NotFound:
            return Response('A Bolha não foi encontrada', status = status.HTTP_404_NOT_FOUND)
        
        try:
            check_in = get_object_or_404(models.CheckIn, bubble = bubble.pk, id = checkin_id)
        except NotFound:
            return Response('Este Check-In não existe', status = status.HTTP_404_NOT_FOUND)
        
        data = request.data
        serializer = serializers.CheckInSerializer(check_in, data = data, partial = True)
        if serializer.is_valid():
            serializer.save()
            return Response("Check-in atualizado com sucesso!", status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)