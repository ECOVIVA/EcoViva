from rest_framework import status
from rest_framework.request import Request
from rest_framework.response import Response

from apps.community.application.ports.repositories.community import CommunityFilter
from apps.community.domain.permissions.permissions import (
    IsCommunityOwner,
)
from apps.community.presentation.views.community.base import CommunityBaseView


class CommunityDeleteView(CommunityBaseView):
    permission_classes = (IsCommunityOwner,)

    def destroy(
        self,
        request: Request,
        *args: object,
        **kwargs: object,
    ) -> Response:
        filter_ = CommunityFilter(slug=self.kwargs.get("slug"))
        instance = self.service.get_community(filter_)

        self.service.delete_community(community_id=instance.id)

        return Response(
            {"detail": "Comunidade deletada com sucesso!"},
            status=status.HTTP_204_NO_CONTENT,
        )
