from rest_framework import permissions
from rest_framework.request import Request
from rest_framework.response import Response

from apps.community.presentation.serializers.community import CommunitySerializer
from apps.community.presentation.views.community.base import CommunityBaseView


class CommunityListView(CommunityBaseView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = CommunitySerializer

    def get(self, request: Request) -> Response:
        communities = self.service.list_communities()

        self.validate_input(communities)

        return self.respond(communities)
