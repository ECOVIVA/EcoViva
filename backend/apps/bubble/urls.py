from django.urls import path  
from . import views  

"""
    Definição das rotas (URLs) para as funcionalidades relacionadas às bolhas.

    - Bolhas:
      - profile/             → Exibe o perfil da bolha do usuário autenticado.
      - <str:username>/      → Lista ou cria bolhas associadas a um usuário.

    - Check-in:
      - check-in/create/     → Registra um novo check-in em uma bolha.
"""

app_name = 'bubble'  # Define o namespace para as URLs deste aplicativo

urlpatterns = [
    # Rotas para gerenciamento de bolhas
    path('profile/', views.BubbleProfileView.as_view(), name="bubble_profile"),  # Exibe o perfil da bolha do usuário autenticado
    path('<str:username>/', views.BubbleUsersView.as_view(), name="bubble"),  # Lista ou cria bolhas associadas a um usuário

    # Rotas para check-in
    path('check-in/create/', views.CheckInCreateView.as_view(), name="check_in_create"),  # Cria um novo check-in em uma bolha
]
