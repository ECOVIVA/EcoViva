from apps.users.auth.permissions import IsCommunityMember
from rest_framework import status
from rest_framework.generics import CreateAPIView
from rest_framework.response import Response

from utils.mixins.community_mixins import ThreadViewMixin


class ThreadLikeView(ThreadViewMixin, CreateAPIView):
    permission_classes = [IsCommunityMember]

    def post(self, request):
        thread_slug = self.kwargs.get("thread_slug")
        thread = self.get_thread_object(thread_slug)

        user = self.request.user

        if thread.likes.filter(id=user.id).exists():
            thread.likes.remove(user)
            return Response({"liked": False}, status=status.HTTP_200_OK)
        thread.likes.add(user)
        return Response({"liked": True}, status=status.HTTP_200_OK)
