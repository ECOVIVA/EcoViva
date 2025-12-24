from rest_framework import status
from rest_framework.generics import ListAPIView, CreateAPIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import NotFound
from apps.study.models.lessons import LessonLog
from apps.study.serializers.lessons import LessonLogSerializer

class LessonLogListView(ListAPIView):
    """
    Lista as lições completadas pelo usuário autenticado.
    """
    serializer_class = LessonLogSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = LessonLog.objects.select_related('user', 'lesson').filter(user=self.request.user)
        if not queryset.exists():
            raise NotFound("Este usuário não completou nenhuma lição.")
        return queryset
 
class LessonLogCreateView(CreateAPIView):
    """
    Registra uma nova lição como concluída pelo usuário.
    """
    serializer_class = LessonLogSerializer
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