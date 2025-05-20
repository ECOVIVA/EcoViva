from django.urls import path, include

app_name = 'community'

urlpatterns = [
    path('', include('apps.community.urls_.community')),
]
