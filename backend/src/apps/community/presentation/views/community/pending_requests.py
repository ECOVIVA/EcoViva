from rest_framework.request import Request
from rest_framework.response import Response

from apps.community.domain.permissions.permissions import (
    IsCommunityAdmin,
)
from apps.community.presentation.views.community.base import CommunityBaseView


class CommunityPendingRequestsView(CommunityBaseView):
    permission_classes = (IsCommunityAdmin,)

    """def get_queryset(self) -> QuerySet[object]:
        community_slug: str = self.kwargs.get("slug")

        community: Community = self.get_community_object(community_slug)
        self.check_object_permissions(self.request, community)

        return community.pending_requests.all()"""

    def get(self, request: Request) -> Response: ...
