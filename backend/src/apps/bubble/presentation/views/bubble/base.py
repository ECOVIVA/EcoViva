from rest_framework import permissions

from apps.bubble.application.service.bubble import BubbleService, BubbleServiceFactory
from core.presentation.views.base import BaseAPIView

service = BubbleServiceFactory.create()


class BubbleBaseAPIView(BaseAPIView[BubbleService]):
    permission_classes = (permissions.IsAuthenticated,)
    service = service
