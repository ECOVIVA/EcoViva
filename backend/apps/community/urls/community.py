from django.urls import path, include
from apps.community.views import community_views

urlpatterns = [
    path('', community_views.CommunityListView.as_view(), name="list_community"),
    path('create/', community_views.CommunityCreateView.as_view(), name='create_community'),
    path('<slug:slug>/', include([
        path('', community_views.CommunityObjectView.as_view(), name='detail_community'),
        path('update/', community_views.CommunityUpdateView.as_view(), name='update_community'),
        path('delete/', community_views.CommunityDeleteView.as_view(), name='delete_community'),
        path('register/', community_views.CommunityRegisterUser.as_view(), name='register_user'),
        path('requests/', community_views.CommunityPendingRequestsView.as_view(), name='pending_requests'),
        path('requests/confirmation/', community_views.CommunityConfirmationRequestsView.as_view(), name='pending_confirmation'),
    ])),
]
