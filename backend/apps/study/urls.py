from django.urls import path
from . import views

app_name = 'study'

urlpatterns = [
    path('lessons/complete/', views.LessonCompletionListView.as_view(), name="lessons_complete"),
    path('lessons/complete/create/', views.LessonCompletionCreateView.as_view(), name="lesson_complete_create"),
    path('achivements/user/', views.UserAchievementsView.as_view(), name="achivements_user"),
]
