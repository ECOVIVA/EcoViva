from typing import Any, override

from django.contrib.auth.models import AbstractBaseUser, AnonymousUser
from rest_framework import permissions
from rest_framework.exceptions import NotFound
from rest_framework.generics import GenericAPIView
from rest_framework.mixins import CreateModelMixin, RetrieveModelMixin
from rest_framework.request import Request
from rest_framework.response import Response

from apps.bubble.infrastructure.model import Bubble
from apps.bubble.presentation.serializer import BubbleSerializer, CheckInSerializer


class BaseBubbleView(GenericAPIView, RetrieveModelMixin, CreateModelMixin):
    def get_bubble(self, user: AbstractBaseUser | AnonymousUser) -> Bubble:
        try:
            return (
                Bubble.objects.select_related("rank", "user")
                .prefetch_related("checkin_set")
                .get(user=user)
            )
        except Bubble.DoesNotExist as e:
            error_msg = "A Bolha não foi encontrada."
            raise NotFound(error_msg) from e

    @override
    def get_object(self) -> Bubble:
        return self.get_bubble(self.request.user)

    @override
    def retrieve(self, request: Request, *args: Any, **kwargs: Any) -> Response:
        obj = super().retrieve(request, *args, **kwargs)
        instance = self.get_object()
        self.check_object_permissions(request, instance)
        return obj

    @override
    def create(self, request: Request, *args: Any, **kwargs: Any) -> Response:
        obj = super().create(request, *args, **kwargs)
        bubble = self.get_bubble(self.request.user)

        data = self.request.data
        data["bubble"] = bubble.pk
        data["xp_earned"] = bubble.rank.difficulty.points_for_activity

        obj.data = {}
        return obj


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
