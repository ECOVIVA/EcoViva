from typing import cast

from rest_framework import permissions
from rest_framework.request import Request
from rest_framework.response import Response

from apps.bubble.presentation.serializers.bubble.profile import BubbleProfileSerializer

from .base import BubbleBaseAPIView


class BubbleProfileView(BubbleBaseAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = BubbleProfileSerializer

    def get(self, request: Request, *args: object, **kwargs: object) -> Response:
        user_id = cast("int", request.user.pk)

        bubble = self.service.get_bubble(user_id)

        return self.respond(bubble)
