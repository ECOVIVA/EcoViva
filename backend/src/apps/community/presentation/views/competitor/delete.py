from apps.community.serializers.events import (
    ChallengeCompetitorSerializer,
)
from apps.users.auth.permissions import IsCommunityAdmin
from rest_framework import status
from rest_framework.generics import DestroyAPIView
from rest_framework.response import Response

from utils.mixins.community_mixins import ChallengeViewMixin


class ChallengeCompetitorDeleteView(ChallengeViewMixin, DestroyAPIView):
    permission_classes = [IsCommunityAdmin]
    serializer_class = ChallengeCompetitorSerializer

    def get_object(self):
        id_challenge = self.kwargs.get("id_challenge")
        id_competitor = self.kwargs.get("id_competitor")
        community_slug = self.kwargs.get("slug")

        object = self.get_competitor(community_slug, id_challenge, id_competitor)

        self.check_object_permissions(self.request, object.challenge.community)
        return object

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(
            {"detail": "Competidor deletado com sucesso!"}, status=status.HTTP_204_NO_CONTENT
        )
