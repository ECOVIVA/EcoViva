from django.urls import path, include
from apps.community.views.events_views import *

urlpatterns = [
    path('gincana/', include([
        path('', GincanaListView.as_view(), name='gincana-list'),
        path('create/', GincanaCreateView.as_view(), name='gincana-create'),

        path('<int:id_gincana>/', include([
            path('', GincanaObjectView.as_view(), name='gincana-detail'),
            path('delete/', GincanaDeleteView.as_view(), name='gincana-delete'),
            path('competitors/create/', GincanaCompetitorCreateView.as_view(), name='gincana-competitor-create'),
            path('competitors/<str:name>/record/create/', GincanaRecordCreateView.as_view(), name='gincana-record-create'),
            path('competitors/<str:name>/delete/', GincanaCompetitorDeleteView.as_view(), name='gincana-competitor-delete'),
            path('competitors/records/', GincanaRecordObjectView.as_view(), name='gincana-record-detail'),]))
        ])),
]
