from apps.community.serializers.events import (
    ChallengeSerializer,
)
from apps.users.auth.permissions import IsCommunityAdmin
from rest_framework import status
from rest_framework.generics import DestroyAPIView
from rest_framework.response import Response

from utils.mixins.community_mixins import ChallengeViewMixin


class ChallengeDeleteView(ChallengeViewMixin, DestroyAPIView):
    permission_classes = [IsCommunityAdmin]
    serializer_class = ChallengeSerializer

    def get_object(self):
        community_slug = self.kwargs.get("slug")
        id_challenge = self.kwargs.get("id_challenge")

        object = self.get_challenge_object(community_slug, id_challenge)

        self.check_object_permissions(self.request, object.community)
        return object

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(
            {"detail": "Gincana deletada com sucesso!"}, status=status.HTTP_204_NO_CONTENT
        )
