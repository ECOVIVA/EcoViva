from apps.community.serializers.events import (
    ChallengeSerializer,
)
from apps.users.auth.permissions import IsCommunityAdmin
from rest_framework import status
from rest_framework.generics import CreateAPIView
from rest_framework.response import Response

from utils.mixins.community_mixins import ChallengeViewMixin


class ChallengeCreateView(ChallengeViewMixin, CreateAPIView):
    permission_classes = [IsCommunityAdmin]
    serializer_class = ChallengeSerializer

    def create(self, request, *args, **kwargs):
        community_slug = self.kwargs.get("slug")
        community = self.get_community_object(community_slug)

        self.check_object_permissions(request, community)

        data = request.data.copy()
        data["created_by"] = request.user.pk
        data["community"] = community.pk

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response({"detail": "Gincana criada com sucesso!"}, status=status.HTTP_201_CREATED)
