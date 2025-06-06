from apps.bubble.models.bubble import Bubble
from rest_framework.exceptions import NotFound

class BubbleMixinView:
    def get_bubble(self, user):
        try:
            return Bubble.objects.select_related('rank', 'user').prefetch_related('checkin_set').get(user=user)
        except Bubble.DoesNotExist:
            raise NotFound("A Bolha não foi encontrada.")