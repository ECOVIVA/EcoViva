from apps.community.serializers.threads import PostsSerializer
from apps.users.auth.permissions import IsPostOwner
from rest_framework import status
from rest_framework.generics import DestroyAPIView
from rest_framework.response import Response

from utils.mixins.community_mixins import PostViewMixin


class PostDeleteView(PostViewMixin, DestroyAPIView):
    permission_classes = [IsPostOwner]
    serializer_class = PostsSerializer

    def get_object(self):
        id_post = self.kwargs.get("id_post")
        object = self.get_post(id_post)
        self.check_object_permissions(self.request, object)
        return object

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response({"detail": "Post deletado com sucesso!"}, status=status.HTTP_204_NO_CONTENT)
