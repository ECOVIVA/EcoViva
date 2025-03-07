from django.urls import path
from . import views


urlpatterns = [
    path('', views.BubbleView.as_view()),
]
