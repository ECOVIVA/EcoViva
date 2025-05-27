from django.urls import path, include
from apps.community.views.gincana_views import *
from apps.community.views.campanha_views import *

urlpatterns = [
    path('challenge/', include([
        path('', ChallengeListView.as_view(), name='challenge-list'),
        path('create/', ChallengeCreateView.as_view(), name='challenge-create'),

        path('<int:id_gincana>/', include([
            path('', ChallengeObjectView.as_view(), name='challenge-detail'),
            path('delete/', ChallengeDeleteView.as_view(), name='challenge-delete'),
            path('competitors/create/', ChallengeCompetitorCreateView.as_view(), name='challenge-competitor-create'),
            path('competitors/record/create/', ChallengeRecordCreateView.as_view(), name='challenge-record-create'),
            path('competitors/<str:name>/delete/', ChallengeCompetitorDeleteView.as_view(), name='challenge-competitor-delete'),]))
        ])),
    path('campaign/', include(
        [
            path('', CampanhaListView.as_view(), name='campanha-list'),              
            path('create/', CampanhaCreateView.as_view(), name='campanha-create'),
            path('<int:id_campanha>/', include(
                [
                path('', CampanhaDetailView.as_view(), name='campanha-detail'),  
                path('update/', CampanhaUpdateView.as_view(), name='campanha-update'), 
                path('delete/', CampanhaDeleteView.as_view(), name='campanha-delete'),   

                path('join/', ToggleCampanhaParticipationView.as_view(), name='campanha-toggle'),  
                path('participants/', ListParticipantsView.as_view(), name='campanha-participants'), 
                ]
            )),              
        ]
    ))
]
