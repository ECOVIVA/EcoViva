from typing import cast

from rest_framework import permissions
from rest_framework.request import Request
from rest_framework.response import Response

from apps.bubble.presentation.serializers.checkin.base import CheckInSerializer

from .base import CheckInBaseView


class BubbleCheckInListView(CheckInBaseView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = CheckInSerializer

    def get(self, request: Request, *args: object, **kwargs: object) -> Response:
        bubble_pk = cast("int", request.user.pk)
        bubble = self.service.list(bubble_pk)

        return self.respond(bubble, status_code=200)
