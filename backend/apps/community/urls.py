from django.urls import path, include
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

app_name = 'community'

urlpatterns = [
    path('communities/', include([
        path('', views.CommunityListView.as_view(), name="list_community"),
        path('create/', views.CommunityCreateView.as_view(), name='create_community'),
        path('<slug:slug>/', include([
            path('', views.CommunityObjectView.as_view(), name='detail_community'),
            path('update/', views.CommunityUpdateView.as_view(), name='update_community'),
            path('delete/', views.CommunityDeleteView.as_view(), name='delete_community'),
            path('requests/', views.CommunityPendingRequestsView.as_view(), name='pending_requests'),
            path('requests/confirmation/', views.CommunityConfirmationRequestsView.as_view(), name='pending_confirmation'),

            path('threads/', include([
                path('create/', views.ThreadCreateView.as_view(), name='create_thread'),
                path('', views.ThreadListView.as_view(), name='list_thread'),
                path('<slug:thread_slug>/', include([
                    path('', views.ThreadDetailView.as_view(), name='detail_thread'),
                    path('like/', views.ThreadLikeView.as_view(), name='like_thread'),
                    path('update/', views.ThreadUpdateView.as_view(), name='update_thread'),
                    path('delete/', views.ThreadDeleteView.as_view(), name='delete_thread'),

                    path('posts/', include([
                        path('create/', views.PostCreateView.as_view(), name='create_post'),
                        path('<int:id_post>/update/', views.PostUpdateView.as_view(), name='post_update'),
                        path('<int:id_post>/delete/', views.PostDeleteView.as_view(), name='post_delete'),
                    ])),
                ])),
            ])),
        ])),
    ])),
]
