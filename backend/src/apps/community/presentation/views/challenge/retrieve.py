from apps.community.serializers.events import (
    ChallengeSerializer,
)
from apps.users.auth.permissions import IsCommunityMember
from rest_framework.generics import RetrieveAPIView

from utils.mixins.community_mixins import ChallengeViewMixin


class ChallengeObjectView(ChallengeViewMixin, RetrieveAPIView):
    permission_classes = [IsCommunityMember]
    serializer_class = ChallengeSerializer

    def get_object(self):
        community_slug = self.kwargs.get("slug")
        id_challenge = self.kwargs.get("id_challenge")

        object = self.get_challenge_object(community_slug, id_challenge)

        self.check_object_permissions(self.request, object.community)
        return object
