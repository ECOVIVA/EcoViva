from rest_framework.request import Request
from rest_framework.response import Response

from apps.community.application.ports.repositories.community import CommunityFilter
from apps.community.application.services.community import (
    CommunityServiceFactory,
)
from apps.community.domain.permissions.permissions import (
    IsCommunityMember,
)
from apps.community.presentation.serializers.community import CommunitySerializer
from apps.community.presentation.views.community.base import CommunityBaseView


class CommunityObjectView(CommunityBaseView):
    permission_classes = (IsCommunityMember,)
    serializer_class = CommunitySerializer

    def get(self, request: Request) -> Response:
        community_slug: str = self.kwargs.get("slug")
        service = CommunityServiceFactory.create()
        filter_ = CommunityFilter(slug=community_slug)

        community = service.get_community(filter_)

        return self.respond(community)
