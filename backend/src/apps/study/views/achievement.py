from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated
from apps.study.models.achievement import AchievementLog
from apps.study.serializers.achievement import AchievementLogSerializer

class UserAchievementsView(ListAPIView):
    """
    Lista todas as conquistas desbloqueadas pelo usuário autenticado.
    """
    serializer_class = AchievementLogSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return AchievementLog.objects.filter(user=self.request.user)