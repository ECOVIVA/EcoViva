from apps.community.serializers.threads import ThreadReadSerializer
from apps.users.auth.permissions import IsCommunityMember, IsPostOwner
from rest_framework import status
from rest_framework.generics import DestroyAPIView, RetrieveAPIView
from rest_framework.response import Response

from utils.mixins.community_mixins import ThreadViewMixin


class ThreadDeleteView(ThreadViewMixin, DestroyAPIView):
    """Deleta uma thread. Apenas o dono da thread pode excluir."""

    permission_classes = [IsPostOwner]

    def get_object(self):
        thread_slug = self.kwargs.get("thread_slug")
        object = self.get_thread_object(thread_slug)
        self.check_object_permissions(self.request, object)
        return object

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(
            {"detail": "Thread deletada com sucesso!"}, status=status.HTTP_204_NO_CONTENT
        )

    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)


class ThreadDetailView(ThreadViewMixin, RetrieveAPIView):
    """Retorna detalhes de uma thread específica."""

    permission_classes = [IsCommunityMember]
    serializer_class = ThreadReadSerializer

    def get_object(self):
        thread_slug = self.kwargs.get("thread_slug")
        object = self.get_thread_object(thread_slug)
        self.check_object_permissions(self.request, object.community)
        return object

    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)
