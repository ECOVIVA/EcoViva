from apps.community.application.services.community import (
    CommunityService,
    CommunityServiceFactory,
)
from core.presentation.views.base import BaseAPIView

service = CommunityServiceFactory.create()


class CommunityBaseView(BaseAPIView[CommunityService]):
    service = service
