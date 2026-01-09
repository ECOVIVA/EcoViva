from apps.community.serializers.threads import ThreadWriteSerializer
from apps.users.auth.permissions import IsPostOwner
from rest_framework import status
from rest_framework.generics import UpdateAPIView
from rest_framework.response import Response

from utils.mixins.community_mixins import ThreadViewMixin


class ThreadUpdateView(ThreadViewMixin, UpdateAPIView):
    permission_classes = [IsPostOwner]
    serializer_class = ThreadWriteSerializer

    def get_object(self):
        thread_slug = self.kwargs.get("thread_slug")
        object = self.get_thread_object(thread_slug)
        self.check_object_permissions(self.request, object)
        return object

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        if getattr(instance, "_prefetched_objects_cache", None):
            instance._prefetched_objects_cache = {}

        return Response({"detail": "Thread atualizada com sucesso!"}, status=status.HTTP_200_OK)

    def patch(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)
