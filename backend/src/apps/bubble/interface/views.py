from rest_framework import permissions
from rest_framework.generics import CreateAPIView, ListAPIView, RetrieveAPIView
from rest_framework.request import Request
from rest_framework.response import Response

from apps.bubble.interface.serializer import (
    BubbleProfileSerializer,
    CheckInSerializer,
)


class BubbleProfileView(RetrieveAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = BubbleProfileSerializer

    def retrieve(self, request: Request, *args: object, **kwargs: object) -> Response:
        return super().retrieve(request, *args, **kwargs)


class BubbleCheckInListView(ListAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = CheckInSerializer

    def list(self, request: Request, *args: object, **kwargs: object) -> Response:
        return super().list(request, *args, **kwargs)


class BubbleCheckInCreateView(CreateAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = CheckInSerializer

    def create(self, request: Request, *args: object, **kwargs: object) -> Response:
        return super().create(request, *args, **kwargs)
