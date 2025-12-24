from django.urls import path

from apps.bubble.presentation.views import BubbleCheckInCreateView, BubbleProfileView

app_name = "bubble"

urlpatterns = [
    path("", BubbleProfileView.as_view(), name="bubble_profile"),
    path("check-in/", BubbleCheckInCreateView.as_view(), name="check_in_create"),
]
