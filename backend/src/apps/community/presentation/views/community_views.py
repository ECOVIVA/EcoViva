from collections.abc import Iterable
from typing import cast

from django.db.models import QuerySet
from rest_framework import permissions, status
from rest_framework.generics import (
    CreateAPIView,
    DestroyAPIView,
    GenericAPIView,
    ListAPIView,
    RetrieveAPIView,
    UpdateAPIView,
)
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.serializers import BaseSerializer

from apps.community.application.dtos.community import CommunityDTO
from apps.community.application.services.community import CommunityServiceAssembler
from apps.community.domain.permissions.permissions import (
    IsCommunityAdmin,
    IsCommunityMember,
    IsCommunityOwner,
)
from apps.community.infrastructure.models.community import Community
from apps.community.presentation.serializers.community import CommunitySerializer
from utils.mixins.community_mixins import CommunityViewMixin


class CommunityListView(ListAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = CommunitySerializer

    def get_queryset(self) -> Iterable[CommunityDTO]:  # type: ignore[override]
        service = CommunityServiceAssembler.create()
        return service.list_communities()


class CommunityObjectView(RetrieveAPIView):
    permission_classes = (IsCommunityMember,)
    serializer_class = CommunitySerializer

    def get_object(self) -> CommunityDTO:
        community_slug: str = self.kwargs.get("slug")
        service = CommunityServiceAssembler.create()

        return service.get_community(slug=community_slug)


class CommunityRegisterUser(CreateAPIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(
        self,
        request: Request,
    ) -> Response:
        community_slug: str = self.kwargs.get("slug")
        user_id = cast("int", request.user.pk)

        service = CommunityServiceAssembler.create()

        service.request_join(community_slug=community_slug, user_id=user_id)

        return Response(
            {"detail": "Usuário adicionado ao grupo."},
            status=status.HTTP_200_OK,
        )


class CommunityPendingRequestsView(CommunityViewMixin, ListAPIView):
    permission_classes = (IsCommunityAdmin,)
    serializer_class = UsersSerializer

    def get_queryset(self) -> QuerySet[object]:
        community_slug: str = self.kwargs.get("slug")

        community: Community = self.get_community_object(community_slug)
        self.check_object_permissions(self.request, community)

        return community.pending_requests.all()


class CommunityConfirmationRequestsView(CommunityViewMixin, GenericAPIView):
    permission_classes = (IsCommunityAdmin,)
    serializer_class = CommunitySerializer

    def post(
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
        )


class CommunityCreateView(CreateAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = CommunitySerializer

    def perform_create(self, serializer: BaseSerializer) -> None:
        serializer.save(user=self.request.user)


class CommunityUpdateView(CommunityViewMixin, UpdateAPIView):
    permission_classes = (IsCommunityAdmin,)
    serializer_class = CommunitySerializer

    def get_object(self) -> CommunityDTO:
        community_slug: str = self.kwargs.get("slug")
        service = CommunityServiceAssembler.create()

        return service.get_community(slug=community_slug)

    def partial_update(
        self,
        request: Request,
        *args: object,
        **kwargs: object,
    ) -> Response:
        instance = self.get_object()

        serializer = self.get_serializer(
            instance,
            data=request.data,
            partial=True,
        )

        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(
            {"detail": "Comunidade atualizada com sucesso!"},
            status=status.HTTP_200_OK,
        )


class CommunityDeleteView(CommunityViewMixin, DestroyAPIView):
    permission_classes = (IsCommunityOwner,)

    def get_object(self) -> CommunityDTO:
        community_slug: str = self.kwargs.get("slug")
        service = CommunityServiceAssembler.create()

        return service.get_community(slug=community_slug)

    def destroy(
        self,
        request: Request,
        *args: object,
        **kwargs: object,
    ) -> Response:
        instance = self.get_object()

        service = CommunityServiceAssembler.create()
        service.delete_community(community_id=instance.id)

        return Response(
            {"detail": "Comunidade deletada com sucesso!"},
            status=status.HTTP_204_NO_CONTENT,
        )
