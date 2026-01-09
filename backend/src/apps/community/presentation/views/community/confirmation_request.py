from apps.community.domain.permissions.permissions import (
    IsCommunityAdmin,
)
from apps.community.presentation.serializers.community import CommunitySerializer
from apps.community.presentation.views.community.base import CommunityBaseView


class CommunityConfirmationRequestsView(CommunityBaseView):
    permission_classes = (IsCommunityAdmin,)
    serializer_class = CommunitySerializer

    """def post(
        self,
        request: Request,
    ) -> Response:
        community_slug: str = self.kwargs.get("slug")
        request_id: int | None = request.data.get("request_id")
        confirmation: bool | None = request.data.get("confirmation")

        if confirmation is None or not isinstance(confirmation, bool):
            return Response(
                {"detail": "A confirmação deve ser um booleano."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        community: Community = self.get_community_object(community_slug)
        self.check_object_permissions(self.request, community)

        user = community.pending_requests.filter(id=request_id).first()

        if confirmation:
            if not user:
                return Response(
                    {"detail": ("Usuário não está na lista de solicitações pendentes.")},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            community.pending_requests.remove(user)
            community.members.add(user)

            return Response(
                {"detail": "Usuário confirmado como membro."},
                status=status.HTTP_200_OK,
            )

        if user:
            community.pending_requests.remove(user)

        return Response(
            {"detail": "Solicitação negada com sucesso."},
            status=status.HTTP_200_OK,
        )"""
