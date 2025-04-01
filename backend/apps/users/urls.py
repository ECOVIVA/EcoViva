from django.urls import path, include  
from . import views  

"""
    Este arquivo define as rotas (URLs) relacionadas aos usuários da aplicação.

    - path('list/', views.UserListView.as_view()):
      Rota para listar todos os usuários. Esta view exibirá uma lista de todos os usuários da aplicação.

    - path('create/', views.UserCreateView.as_view()):
      Rota para criar um novo usuário. Esta view será responsável por criar e salvar um novo usuário no sistema.

    - path('detail/<str:username>/', views.UserDetailView.as_view()):
      Rota para acessar os detalhes de um usuário específico, identificado pelo 'username'. Esta view mostrará informações detalhadas de um usuário.

    - path('profile/', views.UserProfileView.as_view()):
      Rota para acessar o perfil de um usuário específico. Aqui, um usuário poderá ver as informações do seu próprio perfil.

    - path('profile/update/', views.UserUpdateView.as_view()):
      Rota para atualizar as informações do perfil de um usuário. Esta view permitirá editar dados do perfil de um usuário específico.

    - path('profile/delete/', views.UserDeleteView.as_view()):
      Rota para excluir o perfil de um usuário. Esta view permitirá que o usuário delete sua própria conta.

    - path('bubble/', include('apps.bubble.urls')):
      Rota para acessar as funcionalidades relacionadas às bolhas. Isso inclui o redirecionamento para as URLs definidas no aplicativo "bubble".
"""

app_name = 'users'  # Define o namespace para as URLs deste arquivo como 'users'

urlpatterns = [
    path('list/', views.UserListView.as_view(), name="user_list"),  
    path('create/', views.UserCreateView.as_view(), name="user_create"), 
    path('detail/<str:username>/', views.UserDetailView.as_view(), name="user_detail"),
    path('profile/', views.UserProfileView.as_view(), name="user_profile"), 
    path('profile/update/', views.UserUpdateView.as_view(), name="user_update"),  
    path('profile/delete/', views.UserDeleteView.as_view(), name="user_delete"),  
    path('bubble/', include('apps.bubble.urls')),  
]
