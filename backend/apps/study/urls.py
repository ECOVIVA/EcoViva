from django.urls import path  
from . import views  

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
    path('lessons/complete/', views.LessonLogListView.as_view(), name="lessons_complete"),  
    path('lessons/complete/create/', views.LessonCompletionCreateView.as_view(), name="lesson_complete_create"),  

    # Rotas para conquistas do usuário
    path('achievements/user/', views.UserAchievementsView.as_view(), name="achievements_user"),  
]
