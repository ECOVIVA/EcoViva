from backend.core.presentation.views.bubble import BaseBubbleView
from rest_framework import permissions
from rest_framework.request import Request
from rest_framework.response import Response

from apps.bubble.presentation.serializer import BubbleSerializer, CheckInSerializer


class BubbleProfileView(BaseBubbleView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = BubbleSerializer

    def get(self, request: Request, *args: object, **kwargs: object) -> Response:
        return self.retrieve(request, *args, **kwargs)


class BubbleCheckInCreateView(BaseBubbleView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = CheckInSerializer

    def post(self, request: Request, *args: object, **kwargs: object) -> Response:
        return self.create(request, *args, **kwargs)
