from typing import cast

from rest_framework.generics import CreateAPIView, RetrieveAPIView, UpdateAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated

from apps.users.application.dtos.user import UserReadDTO
from apps.users.application.services.user import UserFacadeFactory
from apps.users.interface.serializers.user_create import UsersWriteSerializer
from apps.users.interface.serializers.user_read import UsersReadSerializer
from apps.users.interface.serializers.user_update import UsersUpdateSerializer


class UserCreateView(CreateAPIView):
    permission_classes = (AllowAny,)
    serializer_class = UsersWriteSerializer


class UserProfileView(RetrieveAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = UsersReadSerializer

    def get_object(self) -> UserReadDTO:
        user_id = cast("int", self.request.user.pk)
        service = UserFacadeFactory.create()

        return service.get_user(user_id)


class UserUpdateView(UpdateAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = UsersUpdateSerializer

    def get_object(self) -> UserReadDTO:
        user_id = cast("int", self.request.user.pk)
        service = UserFacadeFactory.create()

        return service.get_user(user_id)
