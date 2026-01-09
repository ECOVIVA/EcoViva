from apps.community.serializers.threads import PostsSerializer
from apps.users.auth.permissions import IsCommunityMember
from rest_framework import status
from rest_framework.generics import CreateAPIView
from rest_framework.response import Response

from utils.mixins.community_mixins import PostViewMixin


class PostCreateView(PostViewMixin, CreateAPIView):
    """Cria um novo post dentro de uma thread. Apenas usuários autenticados podem postar."""

    permission_classes = [IsCommunityMember]
    serializer_class = PostsSerializer

    def create(self, *args, **kwargs):
        community_slug = self.kwargs.get("slug")
        self.check_object_permissions(self.request, self.get_community_object(community_slug))
        data = self.request.data.copy()

        data["author"] = self.request.user.pk
        data["thread"] = self.kwargs.get("thread_slug")

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response({"detail": "Post criado com sucesso!"}, status=status.HTTP_201_CREATED)
