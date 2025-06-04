from django.urls import path, include
from apps.community.views.challenge_views import *
from apps.community.views.campaign_views import *

urlpatterns = [
    path('challenge/', include([
        path('', ChallengeListView.as_view(), name='challenge-list'),
        path('create/', ChallengeCreateView.as_view(), name='challenge-create'),

        path('<int:id_challenge>/', include([
            path('', ChallengeObjectView.as_view(), name='challenge-detail'),
            path('delete/', ChallengeDeleteView.as_view(), name='challenge-delete'),
            path('competitors/create/', ChallengeCompetitorCreateView.as_view(), name='challenge-competitor-create'),
            path('competitors/record/create/', ChallengeRecordCreateView.as_view(), name='challenge-record-create'),
            path('competitors/delete/<int:id_competitor>/', ChallengeCompetitorDeleteView.as_view(), name='challenge-competitor-delete'),]))
        ])),
    path('campaign/', include(
        [
            path('', CampaignListView.as_view(), name='campaign-list'),              
            path('create/', CampaignCreateView.as_view(), name='campaign-create'),
            path('<int:id_campaign>/', include(
                [
                path('', CampaignDetailView.as_view(), name='campaign-detail'),  
                path('update/', CampaignUpdateView.as_view(), name='campaign-update'), 
                path('delete/', CampaignDeleteView.as_view(), name='campaign-delete'),   

                path('join/', ToggleCampaignParticipationView.as_view(), name='campaign-toggle'),  
                path('participants/', ListParticipantsView.as_view(), name='campaign-participants'), 
                ]
            )),              
        ]
    ))
]
