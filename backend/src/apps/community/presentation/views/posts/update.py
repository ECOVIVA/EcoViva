from apps.community.serializers.threads import PostsSerializer
from apps.users.auth.permissions import IsPostOwner
from rest_framework import status
from rest_framework.generics import UpdateAPIView
from rest_framework.response import Response

from utils.mixins.community_mixins import PostViewMixin


class PostUpdateView(PostViewMixin, UpdateAPIView):
    permission_classes = [IsPostOwner]
    serializer_class = PostsSerializer

    def get_object(self):
        id_post = self.kwargs.get("id_post")
        object = self.get_post(id_post)
        self.check_object_permissions(self.request, object)
        return object

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        if getattr(instance, "_prefetched_objects_cache", None):
            instance._prefetched_objects_cache = {}

        return Response({"detail": "Post atualizado com sucesso!"}, status=status.HTTP_200_OK)
