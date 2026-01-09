from apps.community.serializers.events import (
    ChallengeSerializer,
)
from apps.users.auth.permissions import IsCommunityMember
from rest_framework.generics import ListAPIView

from utils.mixins.community_mixins import ChallengeViewMixin


class ChallengeListView(ChallengeViewMixin, ListAPIView):
    permission_classes = [IsCommunityMember]
    serializer_class = ChallengeSerializer

    def get_queryset(self, *args, **kwargs):
        community_slug = self.kwargs.get("slug")
        queryset = self.get_challenge_queryset(community_slug)

        self.check_object_permissions(self.request, queryset.first().community)
        return queryset

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)
