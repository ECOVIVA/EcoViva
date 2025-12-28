from typing import cast

from rest_framework import permissions
from rest_framework.generics import CreateAPIView, ListAPIView, RetrieveAPIView
from rest_framework.serializers import BaseSerializer

from apps.bubble.application.dtos.bubble_profile import BubbleProfileDTO, CheckProfileInDTO
from apps.bubble.application.service.bubble import BubbleService
from apps.bubble.application.service.checkin import CheckInService
from apps.bubble.interface.serializer import (
    BubbleProfileSerializer,
    CheckInCreateSerializer,
    CheckInSerializer,
)


class BubbleProfileView(RetrieveAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = BubbleProfileSerializer

    def get_object(self) -> BubbleProfileDTO:
        return BubbleService().get_bubble(cast("int", self.request.user.pk))


class BubbleCheckInListView(ListAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = CheckInSerializer

    def get_queryset(self) -> list[CheckProfileInDTO]:  # type: ignore
        return CheckInService().list_check_ins_by_user(cast("int", self.request.user.pk))


class BubbleCheckInCreateView(CreateAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = CheckInCreateSerializer

    def perform_create(self, serializer: BaseSerializer) -> None:
        return super().perform_create(serializer)
