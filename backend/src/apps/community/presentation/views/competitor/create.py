from apps.community.serializers.events import (
    ChallengeCompetitorSerializer,
)
from apps.users.auth.permissions import IsCommunityAdmin
from rest_framework import status
from rest_framework.generics import CreateAPIView
from rest_framework.response import Response

from utils.mixins.community_mixins import ChallengeViewMixin


class ChallengeCompetitorCreateView(ChallengeViewMixin, CreateAPIView):
    permission_classes = [IsCommunityAdmin]
    serializer_class = ChallengeCompetitorSerializer

    def create(self, request, *args, **kwargs):
        is_many = isinstance(request.data, list)
        community_slug = self.kwargs.get("slug")
        id_challenge = self.kwargs.get("id_challenge")

        challenge = self.get_challenge_object(community_slug, id_challenge)

        self.check_object_permissions(self.request, challenge.community)

        data = request.data.copy()

        if is_many:
            for item in data:
                item["challenge"] = challenge.pk
        else:
            data["challenge"] = challenge.pk

        serializer = self.get_serializer(data=data, many=is_many)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        return Response(
            {"detail": "Competidor(es) da Gincana registrado(s)."}, status=status.HTTP_201_CREATED
        )
