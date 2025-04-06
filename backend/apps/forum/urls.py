from django.urls import path
from . import views

"""
    Este arquivo define as rotas (URLs) para as funcionalidades do fórum, incluindo Threads e Posts.

    - Threads:
      - list/                 → Lista todas as Threads.
      - create/               → Cria uma nova Thread.
      - detail/<slug:slug>/   → Exibe detalhes de uma Thread específica.
      - detail/<slug:slug>/update/  → Atualiza parcialmente uma Thread.
      - detail/<slug:slug>/delete/  → Exclui uma Thread.

    - Posts:
      - detail/<slug:slug>/posts/   → Lista todos os Posts dentro de uma Thread.
      - post/create/         → Cria um novo Post.
      - post/<int:id_post>/update/  → Atualiza parcialmente um Post.
      - post/<int:id_post>/delete/  → Exclui um Post.
"""

app_name = 'forum'

urlpatterns = [
    # Rotas para Threads
    path('thread/list/', views.ThreadListView.as_view(), name="list_thread"),  
    path('thread/create/', views.ThreadCreateView.as_view(), name='create_thread'), 
    path('thread/<slug:slug>/', views.ThreadDetailView.as_view(), name='detail_thread'), 
    path('thread/<slug:slug>/update/', views.ThreadUpdateView.as_view(), name='update_thread'), 
    path('thread/<slug:slug>/delete/', views.ThreadDeleteView.as_view(), name='delete_thread'), 

    # Rotas para Posts
    path('thread/<slug:slug>/posts/', views.PostListView.as_view(), name='thread_posts'), 
    path('post/create/', views.PostCreateView.as_view(), name='create_post'),  
    path('post/<int:id_post>/update/', views.PostUpdateView.as_view(), name='post_update'),  
    path('post/<int:id_post>/delete/', views.PostDeleteView.as_view(), name='post_delete'),  
]
