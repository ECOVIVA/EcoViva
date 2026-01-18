from collections.abc import Iterable
from typing import TypeVar

from rest_framework import status
from rest_framework.response import Response
from rest_framework.serializers import Serializer
from rest_framework.views import APIView

TService = TypeVar("TService", covariant=True)


class BaseAPIView[TService](APIView):
    service: TService
    serializer_class: type[Serializer] | None = None

    def get_serializer(self, data: object) -> Serializer | None:
        if not self.serializer_class:
            return None

        serializer = self.serializer_class(data=data)
        serializer.is_valid(raise_exception=True)
        return serializer

    def serialize_output(
        self,
        result: object | Iterable[object] | None,
    ) -> object:
        if not self.serializer_class or result is None:
            return result

        is_many = isinstance(result, Iterable) and not isinstance(result, (str, bytes))
        serializer = self.serializer_class(result, many=is_many)  # type: ignore
        return serializer.data

    def respond(
        self,
        result: object | Iterable[object] | None = None,
        status_code: int = status.HTTP_200_OK,
    ) -> Response:
        data = self.serialize_output(result)
        return Response(data, status=status_code)
