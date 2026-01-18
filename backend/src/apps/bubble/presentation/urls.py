from django.urls import path

from apps.bubble.presentation.views.bubble.profile import BubbleProfileView
from apps.bubble.presentation.views.checkin.create import BubbleCheckInCreateView
from apps.bubble.presentation.views.checkin.list import BubbleCheckInListView

app_name = "bubble"

urlpatterns = [
    path("", BubbleProfileView.as_view(), name="bubble_profile"),
    path("check-in/", BubbleCheckInCreateView.as_view(), name="check_in_create"),
    path("check-in/list/", BubbleCheckInListView.as_view(), name="check_in_list"),
]
