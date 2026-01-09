from rest_framework.request import Request
from rest_framework.response import Response

from apps.community.application.ports.repositories.community import CommunityFilter
from apps.community.domain.permissions.permissions import (
    IsCommunityAdmin,
)
from apps.community.presentation.serializers.community import CommunitySerializer
from apps.community.presentation.views.community.base import CommunityBaseView


class CommunityUpdateView(CommunityBaseView):
    permission_classes = (IsCommunityAdmin,)
    serializer_class = CommunitySerializer

    def patch(self, request: Request, *args: object, **kwargs: object) -> Response:
        filter_ = CommunityFilter(slug=self.kwargs.get("slug"))
        instance = self.service.get_community(filter_)

        self.validate_input(request.data)

        new_instance = self.service.update_community(instance, request.data)

        return self.respond(new_instance)
