from rest_framework.views import APIView
from django.shortcuts import get_list_or_404
from django.http import Http404
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from apps.study import models, serializers

class LessonCompletionListView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        try:
            leassons = get_list_or_404(models.LessonCompletion, user = request.user.id)
            serializer = serializers.LessonCompletionSerializer(leassons, many = True)

            return Response(serializer.data, status=status.HTTP_200_OK)
        except Http404:
            return Response({'detail': 'Este usuario não comletou nenhuma lição.'}, status= status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'detail': str(e)}, status= status.HTTP_404_NOT_FOUND)

class LessonCompletionCreateView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        try:
            lesson_complete = request.data['lesson']
        except KeyError:
            return Response({'detail': 'Informe qual foi a lição completada.'}, status= status.HTTP_400_BAD_REQUEST)

        data = {'user': request.user.pk, 'lesson': lesson_complete}

        try:
            serializer = serializers.LessonCompletionSerializer(data = data)
            if serializer.is_valid():
                serializer.save()
                return Response("A lição foi registrada como completada!!", status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class UserAchievementsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Retorna todas as conquistas desbloqueadas pelo usuário autenticado."""
        achievements = models.UserAchievement.objects.filter(user=request.user)
        serializer = serializers.UserAchievementSerializer(achievements, many=True)
        return Response(serializer.data)