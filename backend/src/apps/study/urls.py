from django.urls import path  
from apps.study.views import achievement,lessons  

"""
    Este arquivo define as rotas (URLs) relacionadas ao estudo e progresso do usuário.

    - Lições:
      - lessons/complete/        → Retorna todas as lições concluídas pelo usuário autenticado.
      - lessons/complete/create/ → Registra uma nova lição como concluída.

    - Conquistas:
      - achievements/user/       → Retorna todas as conquistas desbloqueadas pelo usuário autenticado.
"""

# Define o namespace do app para facilitar a organização e reversão de URLs
app_name = 'study'

# Mapeamento das rotas para as views relacionadas ao progresso do usuário no aprendizado
urlpatterns = [
    # Rotas para lições concluídas
    path('lessons/complete/', lessons.LessonLogListView.as_view(), name="lessons_log"),  
    path('lessons/complete/create/', lessons.LessonLogCreateView.as_view(), name="lesson_log_create"),  

    # Rotas para conquistas do usuário
    path('achievements/user/', achievement.UserAchievementsView.as_view(), name="achievements_user"),  
]
