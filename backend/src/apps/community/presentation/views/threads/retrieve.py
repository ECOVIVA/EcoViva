from apps.community.serializers.threads import ThreadReadSerializer
from apps.users.auth.permissions import IsCommunityMember
from rest_framework.generics import RetrieveAPIView

from utils.mixins.community_mixins import ThreadViewMixin


class ThreadDetailView(ThreadViewMixin, RetrieveAPIView):
    permission_classes = [IsCommunityMember]
    serializer_class = ThreadReadSerializer

    def get_object(self):
        thread_slug = self.kwargs.get("thread_slug")
        object = self.get_thread_object(thread_slug)
        self.check_object_permissions(self.request, object.community)
        return object

    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)
