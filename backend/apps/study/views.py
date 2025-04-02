from rest_framework.views import APIView
from django.shortcuts import get_list_or_404
from django.http import Http404
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from apps.study import models, serializers

"""
    Este arquivo contém as views relacionadas ao progresso do usuário nas lições e conquistas.

    As views implementadas são:
    - `LessonCompletionListView`: Retorna todas as lições completadas pelo usuário autenticado.
    - `LessonCompletionCreateView`: Registra uma nova lição como concluída pelo usuário.
    - `UserAchievementsView`: Retorna todas as conquistas desbloqueadas pelo usuário autenticado.

    Todas as views exigem autenticação e garantem que o usuário só acesse seus próprios dados.
"""


class LessonCompletionListView(APIView):
    """
    View para listar as lições completadas pelo usuário autenticado.

    - Requer autenticação.
    - Retorna todas as lições que o usuário concluiu.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        Retorna todas as lições concluídas pelo usuário autenticado.

        - Busca as lições no banco de dados.
        - Serializa os dados antes de retornar.
        - Retorna erro 404 caso o usuário não tenha concluído nenhuma lição.
        """
        try:
            # Busca todas as lições completadas pelo usuário
            lessons = get_list_or_404(models.LessonCompletion, user=request.user.id)

            # Serializa os dados das lições
            serializer = serializers.LessonCompletionSerializer(lessons, many=True)

            # Retorna os dados serializados
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Http404:
            return Response({'detail': 'Este usuário não completou nenhuma lição.'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class LessonCompletionCreateView(APIView):
    """
    View para registrar a conclusão de uma lição pelo usuário autenticado.

    - Requer autenticação.
    - O usuário deve fornecer a lição que foi completada.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """
        Registra uma lição como concluída.

        - Obtém a lição informada na requisição.
        - Associa a lição ao usuário autenticado.
        - Valida e salva os dados.
        - Retorna erro 400 caso a requisição esteja inválida.
        """
        try:
            # Obtém a lição informada na requisição
            lesson_complete = request.data['lesson']
        except KeyError:
            return Response({'detail': 'Informe qual foi a lição completada.'}, status=status.HTTP_400_BAD_REQUEST)

        # Prepara os dados para serialização
        data = {'user': request.user.pk, 'lesson': lesson_complete}

        try:
            # Serializa e valida os dados da lição completada
            serializer = serializers.LessonCompletionSerializer(data=data)
            if serializer.is_valid():
                serializer.save()  # Salva a nova lição concluída no banco de dados
                return Response("A lição foi registrada como completada!!", status=status.HTTP_201_CREATED)

            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class UserAchievementsView(APIView):
    """
    View para listar todas as conquistas desbloqueadas pelo usuário autenticado.

    - Requer autenticação.
    - Retorna todas as conquistas associadas ao usuário.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        Retorna todas as conquistas desbloqueadas pelo usuário autenticado.

        - Busca as conquistas do usuário no banco de dados.
        - Serializa os dados antes de retornar.
        """
        # Busca todas as conquistas do usuário autenticado
        achievements = models.UserAchievement.objects.filter(user=request.user)

        # Serializa os dados das conquistas
        serializer = serializers.UserAchievementSerializer(achievements, many=True)

        # Retorna os dados serializados
        return Response(serializer.data)
