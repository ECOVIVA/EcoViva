from rest_framework import permissions

from apps.bubble.application.service.checkin import CheckInService, CheckInServiceFactory
from core.presentation.views.base import BaseAPIView

service = CheckInServiceFactory.create()


class CheckInBaseView(BaseAPIView[CheckInService]):
    permission_classes = (permissions.IsAuthenticated,)
    service = service
