from rest_framework import generics, mixins, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import NotFound
from apps.study import models, serializers

class LessonLogListView(mixins.ListModelMixin, generics.GenericAPIView):
    """
    Lista as lições completadas pelo usuário autenticado.
    """
    serializer_class = serializers.LessonLogSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = models.LessonLog.objects.filter(user=self.request.user)
        if not queryset.exists():
            raise NotFound("Este usuário não completou nenhuma lição.")
        return queryset

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)


class LessonCompletionCreateView(mixins.CreateModelMixin, generics.GenericAPIView):
    """
    Registra uma nova lição como concluída pelo usuário.
    """
    serializer_class = serializers.LessonLogSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        data = request.data.copy()

        if 'lesson' not in data:
            return Response({'detail': 'Informe qual foi a lição completada.'}, status=status.HTTP_400_BAD_REQUEST)

        data['user'] = request.user.pk
        serializer = self.get_serializer(data=data)

        if serializer.is_valid():
            serializer.save()
            return Response("A lição foi registrada como completada!!", status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserAchievementsView(mixins.ListModelMixin, generics.GenericAPIView):
    """
    Lista todas as conquistas desbloqueadas pelo usuário autenticado.
    """
    serializer_class = serializers.AchievementLogSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return models.AchievementLog.objects.filter(user=self.request.user)

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)
