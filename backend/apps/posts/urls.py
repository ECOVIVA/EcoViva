from django.urls import path
from . import views

"""
    Este arquivo define as rotas (URLs) relacionadas aos posts da aplicação.

    - path('', views.PostView.as_view()):
      Rota principal que permite listar todos os posts ou criar um novo post.

    - path('<int:id>/', views.PostDetailView.as_view()):
      Rota para acessar, atualizar ou excluir um post específico, identificado pelo 'id'.
"""

urlpatterns = [
    path('', views.PostView.as_view()),
    path('<int:id>/', views.PostDetailView.as_view())
]
