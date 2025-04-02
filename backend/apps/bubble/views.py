from django.shortcuts import get_list_or_404, get_object_or_404
from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework.exceptions import NotFound

from apps.bubble import models, serializers
from apps.users.auth.permissions import IsOwnerOrReadOnly, IsBubbleOwner

"""
    Este arquivo contém as views da aplicação 'Bubble', que processam as requisições HTTP 
    relacionadas às bolhas e check-ins. Elas lidam com a interação entre o usuário e o sistema, 
    manipulando os dados e retornando respostas apropriadas, como JSON, para as APIs.
"""

class BubbleUsersView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request, username):
        try:
            # Busca a bolha associada ao usuário
            bubble = get_object_or_404(models.Bubble, user__username=username)
            serializer = serializers.BubbleSerializer(bubble)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except NotFound:
            # Caso não encontre a bolha, retorna erro
            return Response('A Bolha não foi encontrada', status=status.HTTP_404_NOT_FOUND)
        
class BubbleProfileView(APIView):
    permission_classes = [IsBubbleOwner]
    
    def get(self, request):
        try:
            # Busca a bolha do usuário autenticado
            bubble = get_object_or_404(models.Bubble, user=request.user.id)
            serializer = serializers.BubbleSerializer(bubble)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Http404:
            # Caso não encontre a bolha, retorna erro
            return Response('A Bolha não foi encontrada', status=status.HTTP_404_NOT_FOUND)


class CheckInView(APIView):
    permission_classes = [IsOwnerOrReadOnly]

    def get(self, request):
        try:
            # Busca a bolha do usuário autenticado
            bubble = get_object_or_404(models.Bubble, user=request.user.id)
        except NotFound:
            # Caso não encontre a bolha, retorna erro
            return Response('A Bolha não foi encontrada', status=status.HTTP_404_NOT_FOUND)
        
        try:
            # Busca todos os check-ins registrados na bolha
            check_in = get_list_or_404(models.CheckIn, bubble=bubble.pk)
            serializer = serializers.CheckInSerializer(check_in, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except NotFound:
            # Caso não haja check-ins, retorna mensagem de erro
            return Response('Não há check-ins registrados nessa bolha.', status=status.HTTP_404_NOT_FOUND)

class CheckInCreateView(APIView):
    permission_classes = [IsBubbleOwner]
    
    def post(self, request):
        try:
            # Busca a bolha do usuário autenticado
            bubble = get_object_or_404(models.Bubble, user=request.user.id)
        except Http404:
            # Caso não encontre a bolha, retorna erro
            return Response('A Bolha não foi encontrada', status=status.HTTP_404_NOT_FOUND)
        
        # Adiciona o ID da bolha ao request
        data = request.data
        data['bubble'] = bubble.id
        serializer = serializers.CheckInSerializer(data=data)

        if serializer.is_valid():
            # Cria o check-in e atribui XP automaticamente
            checkin = serializer.save()
            bubble = checkin.bubble
            difficulty = bubble.rank.difficulty

            if difficulty:
                # Atualiza o progresso da bolha
                bubble.progress += difficulty.points_for_activity
                bubble.save()

                # Atualiza o rank da bolha se necessário
                next_rank = models.Rank.objects.filter(points__lte=bubble.progress).order_by('-points').first()
                if next_rank and next_rank != bubble.rank:
                    bubble.rank = next_rank
                    bubble.progress = 0
                    bubble.save()

                    return Response({
                            "message": f"Parabéns! Você subiu de rank para {next_rank.name}. Seu novo rank é {next_rank.name}.",
                            "new_rank": next_rank.name
                        }, status=status.HTTP_200_OK)
                
            return Response("Check-in criado com sucesso!!", status=status.HTTP_201_CREATED)

        # Retorna erro caso o serializer seja inválido
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CheckInDetailView(APIView):
    permission_classes = [IsBubbleOwner]

    def get(self, request, checkin_id):
        try:
            # Busca a bolha do usuário autenticado
            bubble = get_object_or_404(models.Bubble, user=request.user)
        except NotFound:
            # Caso não encontre a bolha, retorna erro
            return Response('A Bolha não foi encontrada', status=status.HTTP_404_NOT_FOUND)
        
        try:
            # Busca o check-in específico
            check_in = get_object_or_404(models.CheckIn, bubble=bubble.pk, id=checkin_id)
            serializer = serializers.CheckInSerializer(check_in)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except NotFound:
            # Caso não encontre o check-in, retorna erro
            return Response('Este Check-In não existe', status=status.HTTP_404_NOT_FOUND)
