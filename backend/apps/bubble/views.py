from django.shortcuts import get_object_or_404  
from rest_framework.generics import GenericAPIView
from rest_framework.mixins import ( RetrieveModelMixin, CreateModelMixin, UpdateModelMixin, DestroyModelMixin)
from django.http import Http404  
from rest_framework.response import Response  
from rest_framework import status, permissions  

from apps.study.serializers import AchievementSerializer
from apps.bubble import models, serializers  
from utils.check_achievement import CheckAchievementsCheckIn

"""
    Este módulo define as views da aplicação "Bubble", responsáveis por processar requisições HTTP 
    relacionadas às bolhas e check-ins. 

    - BubbleProfileView    → Obtém a bolha do usuário autenticado.
    - CheckInCreateView    → Permite a criação de um novo check-in.
"""  

class BubbleProfileView(GenericAPIView, RetrieveModelMixin):  
    """
    Retorna a bolha do usuário autenticado.
    Apenas o dono da bolha pode acessar esta rota.
    """
    permission_classes = [permissions.IsAuthenticated]  
    serializer_class = serializers.BubbleSerializer

    def get_object(self):
        try:  
            return get_object_or_404(models.Bubble, user=self.request.user.id)  
        except Http404:  
            return Response('A Bolha não foi encontrada', status=status.HTTP_404_NOT_FOUND)  
    
    def get(self, request, *args, **kwargs):  
        return self.retrieve(request, *args, **kwargs)
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        self.check_object_permissions(request, instance)
        serializer = self.get_serializer(instance)
        return Response(serializer.data)


class CheckInCreateView(GenericAPIView, CreateModelMixin):  
    """
    Cria um novo check-in para a bolha do usuário autenticado.
    Atualiza o progresso da bolha e verifica se houve mudança de rank.
    Apenas o dono da bolha pode acessar esta rota.
    """
    permission_classes = [permissions.IsAuthenticated]  
    serializer_class = serializers.CheckInSerializer
    
    def get_object(self):
        try:  
            return get_object_or_404(models.Bubble, user=self.request.user.id)  
        except Http404:  
            return Response('A Bolha não foi encontrada', status=status.HTTP_404_NOT_FOUND) 

    def get_badge(self):
        check_badge = CheckAchievementsCheckIn()
        unlocked = check_badge.check_achievements_for_user(user = self.request.user)
        return AchievementSerializer(unlocked, many=True).data
    
    def post(self, request, *args, **kwargs):  
        return self.create(request, *args, **kwargs)
    
    def create(self, request, *args, **kwargs):
        bubble = self.get_object()

        data = request.data  
        data['bubble'] = bubble.id
        data['xp_earned'] = bubble.rank.difficulty.points_for_activity 

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        new_badges = self.get_badge()
        
        return Response(
            {"detail": "Check-in criado com sucesso!", "new_badges": new_badges}, status=status.HTTP_201_CREATED
            )
  