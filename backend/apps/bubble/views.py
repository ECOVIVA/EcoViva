from django.shortcuts import get_list_or_404, get_object_or_404  
from django.http import Http404  
from rest_framework.views import APIView  
from rest_framework.response import Response  
from rest_framework import status, permissions  
from rest_framework.exceptions import NotFound  

from apps.bubble import models, serializers  
from apps.users.auth.permissions import IsBubbleOwner  

"""
    Este módulo define as views da aplicação "Bubble", responsáveis por processar requisições HTTP 
    relacionadas às bolhas e check-ins. 

    - BubbleUsersView      → Obtém a bolha associada a um usuário específico.
    - BubbleProfileView    → Obtém a bolha do usuário autenticado.
    - CheckInView          → Obtém todos os check-ins registrados em uma bolha.
    - CheckInCreateView    → Permite a criação de um novo check-in e atualiza o progresso da bolha.
    - CheckInDetailView    → Obtém detalhes de um check-in específico.
"""

class BubbleUsersView(APIView):  
    """
    Retorna a bolha associada a um usuário específico.
    Apenas usuários autenticados podem acessar esta rota.
    """
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
    """
    Retorna a bolha do usuário autenticado.
    Apenas o dono da bolha pode acessar esta rota.
    """
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
    """
    Retorna todos os check-ins registrados na bolha do usuário autenticado.
    Apenas o dono da bolha pode acessar esta rota.
    """
    permission_classes = [permissions.IsAuthenticated]  
    
    def get(self, request):  
        try:  
            # Busca a bolha do usuário autenticado  
            bubble = get_object_or_404(models.Bubble, user=request.user.id)  
        except NotFound:  
            return Response('A Bolha não foi encontrada', status=status.HTTP_404_NOT_FOUND)  
        
        try:  
            # Busca todos os check-ins registrados na bolha  
            check_in = get_list_or_404(models.CheckIn, bubble=bubble.pk)  
            serializer = serializers.CheckInSerializer(check_in, many=True)  
            return Response(serializer.data, status=status.HTTP_200_OK)  
        except NotFound:  
            return Response('Não há check-ins registrados nessa bolha.', status=status.HTTP_404_NOT_FOUND)  


class CheckInCreateView(APIView):  
    """
    Cria um novo check-in para a bolha do usuário autenticado.
    Atualiza o progresso da bolha e verifica se houve mudança de rank.
    Apenas o dono da bolha pode acessar esta rota.
    """
    permission_classes = [IsBubbleOwner]  
    
    def post(self, request):  
        try:  
            # Busca a bolha do usuário autenticado  
            bubble = get_object_or_404(models.Bubble, user=request.user.id)  
        except Http404:  
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

                # Verifica se há um novo rank disponível  
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

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)  


class CheckInDetailView(APIView):  
    """
    Retorna os detalhes de um check-in específico da bolha do usuário autenticado.
    Apenas o dono da bolha pode acessar esta rota.
    """
    permission_classes = [IsBubbleOwner]  
    
    def get(self, request, checkin_id):  
        try:  
            # Busca a bolha do usuário autenticado  
            bubble = get_object_or_404(models.Bubble, user=request.user)  
        except NotFound:  
            return Response('A Bolha não foi encontrada', status=status.HTTP_404_NOT_FOUND)  
        
        try:  
            # Busca o check-in específico  
            check_in = get_object_or_404(models.CheckIn, bubble=bubble.pk, id=checkin_id)  
            serializer = serializers.CheckInSerializer(check_in)  
            return Response(serializer.data, status=status.HTTP_200_OK)  
        except NotFound:  
            return Response('Este Check-In não existe', status=status.HTTP_404_NOT_FOUND)  
