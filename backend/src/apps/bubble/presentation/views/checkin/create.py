from typing import cast

from rest_framework import permissions
from rest_framework.request import Request
from rest_framework.response import Response

from apps.bubble.presentation.serializers.checkin.create import CheckInCreateSerializer

from .base import CheckInBaseView


class BubbleCheckInCreateView(CheckInBaseView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = CheckInCreateSerializer

    def post(self, request: Request, *args: object, **kwargs: object) -> Response:
        serializer = cast("CheckInCreateSerializer", self.get_serializer(request.data))
        dto = serializer.create_dto()
        self.service.create(dto)

        return self.respond(status_code=201)
