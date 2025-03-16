from django.urls import path
from . import views

"""
    Este arquivo define as rotas (URLs) relacionadas aos posts da aplicação.

    - path('', views.PostView.as_view()):
      Rota principal que permite listar todos os posts ou criar um novo post.

    - path('<int:id>/', views.PostDetailView.as_view()):
      Rota para acessar, atualizar ou excluir um post específico, identificado pelo 'id'.
"""
app_name = 'forum'

urlpatterns = [
    # Urls de Threads
    path('list/', views.ThreadListView.as_view(), name="list_thread"),
    path('create/', views.ThreadCreateView.as_view(), name='create_thread'),
    path('detail/<slug:slug>/', views.ThreadDetailView.as_view(), name='detail_thread'),
    path('detail/<slug:slug>/update/', views.ThreadUpdateView.as_view(), name='update_thread'),
    path('detail/<slug:slug>/delete/', views.ThreadDeleteView.as_view(), name='delete_thread'),

    # Urls de Posts
    path('detail/<slug:slug>/posts/', views.PostListView.as_view(), name='thread_posts'),
    path('post/create/', views.PostCreateView.as_view(), name='create_post'),
    path('post/<int:id_post>/update/', views.PostUpdateView.as_view(), name='post_update'),
    path('post/<int:id_post>/delete/', views.PostDeleteView.as_view(), name='post_delete'),
]
