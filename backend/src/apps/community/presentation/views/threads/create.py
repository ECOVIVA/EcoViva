from apps.community.serializers.threads import ThreadWriteSerializer
from apps.users.auth.permissions import IsCommunityMember
from rest_framework import status
from rest_framework.generics import CreateAPIView
from rest_framework.response import Response

from utils.mixins.community_mixins import ThreadViewMixin


class ThreadCreateView(ThreadViewMixin, CreateAPIView):
    """Cria uma nova thread. Apenas usuários autenticados podem acessar."""

    permission_classes = [IsCommunityMember]
    serializer_class = ThreadWriteSerializer

    def create(self, request, *args, **kwargs):
        community_slug = self.kwargs.get("slug")
        data = request.data.copy()

        data["author"] = request.user.pk
        data["community"] = community_slug

        self.check_object_permissions(self.request, self.get_community_object(community_slug))

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response({"detail": "Thread criada com sucesso!"}, status=status.HTTP_201_CREATED)

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)
