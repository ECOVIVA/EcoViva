from django.urls import path
from . import views

"""
    Este arquivo define as rotas (URLs) relacionadas aos posts da aplicação.

    - path('', views.PostView.as_view()):
      Rota principal que permite listar todos os posts ou criar um novo post.

    - path('<int:id>/', views.PostDetailView.as_view()):
      Rota para acessar, atualizar ou excluir um post específico, identificado pelo 'id'.
"""
app_name = 'posts'

urlpatterns = [
    path('list/', views.ThreadListView.as_view()),
    path('create/', views.ThreadCreateView.as_view()),
    path('<slug:slug>/', views.ThreadDetailView.as_view()),
    path('<slug:slug>/posts/', views.PostListView.as_view()),
    path('<slug:slug>/posts/create', views.PostCreateView.as_view()),
    path('<slug:slug>/posts/update', views.PostUpdateView.as_view()),
    path('<slug:slug>/posts/delete', views.PostDeleteView.as_view()),
]
