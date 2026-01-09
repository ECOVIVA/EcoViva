from apps.community.serializers.events import (
    ChallengeRecordSerializer,
)
from apps.users.auth.permissions import IsCommunityAdmin
from rest_framework import status
from rest_framework.exceptions import NotFound
from rest_framework.generics import CreateAPIView
from rest_framework.response import Response

from utils.mixins.community_mixins import ChallengeViewMixin


class ChallengeRecordCreateView(ChallengeViewMixin, CreateAPIView):
    permission_classes = [IsCommunityAdmin]
    serializer_class = ChallengeRecordSerializer

    def create(self, request, *args, **kwargs):
        data = request.data.copy()

        community_slug = self.kwargs.get("slug")
        id_challenge = self.kwargs.get("id_challenge")
        id_competitor = data.get("competitor_group")

        if not id_competitor:
            raise NotFound("ID do competidor não informado.")

        competitor = self.get_competitor(community_slug, id_challenge, id_competitor)

        self.check_object_permissions(request, competitor.challenge.community)

        data["registered_by"] = request.user.pk
        data["challenge"] = competitor.challenge.pk

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        return Response({"detail": "Registro criado com sucesso!"}, status=status.HTTP_201_CREATED)
