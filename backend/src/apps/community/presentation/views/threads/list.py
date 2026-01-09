from apps.community.serializers.threads import ThreadReadSerializer
from apps.users.auth.permissions import IsCommunityMember
from rest_framework.generics import ListAPIView

from utils.mixins.community_mixins import ThreadViewMixin


class ThreadListView(ThreadViewMixin, ListAPIView):
    """Retorna uma lista com todas as threads cadastradas."""

    permission_classes = [IsCommunityMember]
    serializer_class = ThreadReadSerializer

    def get_queryset(self):
        community_slug = self.kwargs.get("slug")
        queryset = self.get_thread_list(community_slug)
        self.check_object_permissions(self.request, queryset.first().community)
        return queryset

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)
