from django.urls import path, include  
from . import views  

"""
    Este arquivo define as rotas (URLs) relacionadas aos usuários da aplicação.

    - Usuários:
      - list/                 → Lista todos os usuários.
      - create/               → Cria um novo usuário.
      - detail/<str:username>/ → Exibe os detalhes de um usuário específico.
      - profile/              → Exibe o perfil do usuário autenticado.
      - profile/update/       → Atualiza o perfil do usuário autenticado.
      - profile/delete/       → Exclui o perfil do usuário autenticado.

    - Bolhas (Bubble):
      - bubble/               → Redireciona para as funcionalidades relacionadas às bolhas, definidas no aplicativo "bubble".
"""

app_name = 'users'

urlpatterns = [
    # Rotas para gerenciamento de usuários
    path('create/', views.UserCreateView.as_view(), name="user_create"),  
    path('profile/', views.UserProfileView.as_view(), name="user_profile"), 
    path('profile/update/', views.UserUpdateView.as_view(), name="user_update"), 
    path('profile/delete/', views.UserDeleteView.as_view(), name="user_delete"), 

    # Rotas relacionadas às bolhas
    path('bubble/', include('apps.bubble.urls')),  
]
