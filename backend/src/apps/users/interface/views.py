from typing import cast

from rest_framework.generics import CreateAPIView, RetrieveAPIView, UpdateAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated

from apps.users.application.services.user import UserService
from apps.users.domain.entities.user import UserEntity
from apps.users.interface.serializers import UsersReadSerializer, UsersWriteSerializer


class UserCreateView(CreateAPIView):
    permission_classes = (AllowAny,)
    serializer_class = UsersWriteSerializer


class UserProfileView(RetrieveAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = UsersReadSerializer

    def get_object(self) -> UserEntity:
        user_id = cast("int", self.request.user.pk)
        return UserService().get_user(user_id)


class UserUpdateView(UpdateAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = UsersWriteSerializer

    def get_object(self) -> object:
        user_id = cast("int", self.request.user.pk)
        return UserService().get_user(user_id)
