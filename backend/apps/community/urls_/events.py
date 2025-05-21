from django.urls import path, include
from apps.community.views.events_views import *

urlpatterns = [
    path('', GincanaListView.as_view(), name='gincana-list'),
    path('create/', GincanaCreateView.as_view(), name='gincana-create'),

    path('<int:id>/', include([
        path('', GincanaObjectView.as_view(), name='gincana-detail'),
        path('delete/', GincanaDeleteView.as_view(), name='gincana-delete'),
        path('competitor/<int:group_id>/record/create/', GincanaRecordCreateView.as_view(), name='gincana-record-create'),
    ])),

    path('competitors/create/', GincanaCompetitorCreateView.as_view(), name='gincana-competitor-create'),
    path('competitors/<int:id>/<slug:name>/delete/', GincanaCompetitorDeleteView.as_view(), name='gincana-competitor-delete'),

    path('records/<int:id>/', GincanaRecordObjectView.as_view(), name='gincana-record-detail'),
]
