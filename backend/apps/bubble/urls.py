from django.urls import path
from . import views

"""
    Este arquivo define as rotas (URLs) relacionadas às bolhas da aplicação.

    - path('', views.BubbleView.as_view()):
      Rota principal que permite listar todas as bolhas ou criar uma nova bolha.

    - path('check-in/', views.CheckInView.as_view()):
      Rota para listar ou realizar check-in em uma bolha específica.

    - path('check-in/<int:checkin_id>/', views.CheckInDetailView.as_view()):
      Rota para acessar ou atualizar um check-in específico dentro de uma bolha.
"""

app_name = 'bubble'

urlpatterns = [
    path('profile/', views.BubbleProfileView.as_view(), name="bubble_profile"),
    path('<str:username>/', views.BubbleUsersView.as_view(), name="bubble"),
    path('check-in/create/', views.CheckInCreateView.as_view(), name="check_in_create"),
]
