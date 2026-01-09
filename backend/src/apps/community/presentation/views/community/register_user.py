from typing import cast

from rest_framework import permissions, status
from rest_framework.request import Request
from rest_framework.response import Response

from apps.community.presentation.views.community.base import CommunityBaseView


class CommunityRegisterUser(CommunityBaseView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(
        self,
        request: Request,
    ) -> Response:
        community_slug: str = self.kwargs.get("slug")
        user_id = cast("int", request.user.pk)

        self.service.request_join(community_slug=community_slug, user_id=user_id)

        return Response(
            {"detail": "Usuário adicionado ao grupo."},
            status=status.HTTP_200_OK,
        )
