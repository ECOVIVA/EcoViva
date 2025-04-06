from django.shortcuts import get_list_or_404, get_object_or_404  
from django.http import Http404  
from rest_framework.views import APIView  
from rest_framework.response import Response  
from rest_framework import status, permissions  
from rest_framework.exceptions import NotFound  

from apps.bubble import models, serializers  

"""
    Este módulo define as views da aplicação "Bubble", responsáveis por processar requisições HTTP 
    relacionadas às bolhas e check-ins. 

    - BubbleProfileView    → Obtém a bolha do usuário autenticado.
    - CheckInCreateView    → Permite a criação de um novo check-in.
"""  

class BubbleProfileView(APIView):  
    """
    Retorna a bolha do usuário autenticado.
    Apenas o dono da bolha pode acessar esta rota.
    """
    permission_classes = [permissions.IsAuthenticated]  
    
    def get(self, request):  
        try:  
            # Busca a bolha do usuário autenticado  
            bubble = get_object_or_404(models.Bubble, user=request.user.id)  
        except Http404:  
            # Caso não encontre a bolha, retorna erro  
            return Response('A Bolha não foi encontrada', status=status.HTTP_404_NOT_FOUND) 
        
        self.check_object_permissions(request, bubble)
        serializer = serializers.BubbleSerializer(bubble)  
        return Response(serializer.data, status=status.HTTP_200_OK)     

class CheckInCreateView(APIView):  
    """
    Cria um novo check-in para a bolha do usuário autenticado.
    Atualiza o progresso da bolha e verifica se houve mudança de rank.
    Apenas o dono da bolha pode acessar esta rota.
    """
    permission_classes = [permissions.IsAuthenticated]  
    
    def post(self, request):  
        try:  
            # Busca a bolha do usuário autenticado  
            bubble = get_object_or_404(models.Bubble, user=request.user.id)  
        except Http404:  
            return Response('A Bolha não foi encontrada', status=status.HTTP_404_NOT_FOUND)  
        
        # Adiciona o ID da bolha ao request  
        data = request.data  
        data['bubble'] = bubble.id
        data['xp_earned'] = bubble.rank.difficulty.points_for_activity 

        self.check_object_permissions(request, bubble)

        serializer = serializers.CheckInSerializer(data=data)  

        if serializer.is_valid():  
            # Cria o check-in
            serializer.save()  

            return Response("Check-in criado com sucesso!!", status=status.HTTP_201_CREATED)  
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)  