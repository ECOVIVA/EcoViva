from django.urls import path, include
from apps.community.views import threads_views, posts_views

urlpatterns = [
    path('create/', threads_views.ThreadCreateView.as_view(), name='create_thread'),
    path('', threads_views.ThreadListView.as_view(), name='list_thread'),
    path('<slug:thread_slug>/', include([
        path('', threads_views.ThreadDetailView.as_view(), name='detail_thread'),
        path('like/', threads_views.ThreadLikeView.as_view(), name='like_thread'),
        path('update/', threads_views.ThreadUpdateView.as_view(), name='update_thread'),
        path('delete/', threads_views.ThreadDeleteView.as_view(), name='delete_thread'),

        path('posts/', include([
            path('create/', posts_views.PostCreateView.as_view(), name='create_post'),
            path('<int:id_post>/update/', posts_views.PostUpdateView.as_view(), name='post_update'),
            path('<int:id_post>/delete/', posts_views.PostDeleteView.as_view(), name='post_delete'),
        ])),
    ])),
]
