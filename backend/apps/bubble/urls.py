from django.urls import path
from . import views

"""
    Definição das rotas (URLs) para as funcionalidades relacionadas às bolhas.

    - path('profile/', views.BubbleProfileView.as_view()):
      Rota para acessar o perfil da bolha.

    - path('<str:username>/', views.BubbleUsersView.as_view()):
      Rota para listar ou criar bolhas associadas a um usuário.

    - path('check-in/create/', views.CheckInCreateView.as_view()):
      Rota para criar um novo check-in em uma bolha.
"""

app_name = 'bubble'

urlpatterns = [
    path('profile/', views.BubbleProfileView.as_view(), name="bubble_profile"),
    path('<str:username>/', views.BubbleUsersView.as_view(), name="bubble"),
    path('check-in/create/', views.CheckInCreateView.as_view(), name="check_in_create"),
]
