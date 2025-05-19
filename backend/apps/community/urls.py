from django.urls import path, include

app_name = 'community'

urlpatterns = [
    path('communities/', include([
        path('', include('apps.community.urls.community')),
        path('threads/', include([
            path('', include('apps.community.urls.thread')),
        ])),
    ])),
]
