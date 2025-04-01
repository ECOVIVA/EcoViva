from django.urls import path, include
from .email.views import EmailConfirmAPIView
from . import views

"""
    Este arquivo define as rotas (URLs) relacionadas aos usuários da aplicação.

    - path('', views.UserView.as_view()):
      Rota principal que permite listar todos os usuários ou criar um novo usuário.

    - path('<str:username>/', views.UserDetailView.as_view()):
      Rota para acessar, atualizar ou excluir um usuário específico, identificado pelo 'username'.

    - path('<str:username>/bubble/', include('apps.bolha.urls')):
      Rota para acessar as funcionalidades relacionadas às bolhas associadas a um usuário específico.
"""

app_name = 'users'

urlpatterns = [
    path('list/', views.UserListView.as_view(), name="user_list"),
    path('create/', views.UserCreateView.as_view(), name="user_create"),
    path('detail/<str:username>/', views.UserDetailView.as_view(), name="user_detail"),
    path('update/<str:username>/', views.UserUpdateView.as_view(), name="user_update"),
    path('delete/<str:username>/', views.UserDeleteView.as_view(), name="user_delete"),
    path('bubble/', include('apps.bubble.urls')),
]
