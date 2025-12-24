from apps.community.models.threads import Thread, Post
from apps.community.models.community import Community
from apps.community.models.events import Campaign, Challenge, ChallengeCompetitor

from django.db.models import Count
from rest_framework.exceptions import NotFound

class CommunityViewMixin:
    def get_community_list(self):
        community = Community.objects.select_related('owner').prefetch_related('members')
        if not community:
            raise NotFound("Não há comunidades!")
        return community
    
    def get_community_object(self, community_slug):
        try:
            return Community.objects.select_related('owner').prefetch_related('admins', 'members', 'pending_requests').get(slug = community_slug)
        except Community.DoesNotExist:
            raise NotFound("Comunidade não encontrada!")
        
class ThreadViewMixin(CommunityViewMixin):
    def get_thread_list(self, community_slug):
        queryset = Thread.objects.select_related('author', 'community').prefetch_related('likes', 'tags').filter(community__slug = community_slug)
        if not queryset.exists():
            raise NotFound("Thread não encontrada!")
        return queryset
    
    def get_thread_object(self, thread_slug):
        try:
            return Thread.objects.select_related('author', 'community').prefetch_related('likes', 'tags', 'posts', 'posts__author').annotate(likes_count=Count('likes')).get(slug = thread_slug)
        except Thread.DoesNotExist:
            raise NotFound("Thread não encontrada!")
        
class PostViewMixin(CommunityViewMixin):
    def get_post(self, id_post):
        try:
            object = Post.objects.select_related('author', 'thread').get(id = id_post)
            return object
        except Post.DoesNotExist:
            raise NotFound("Post não encontrado!")
        
class ChallengeViewMixin(CommunityViewMixin):
    def get_challenge_queryset(self, community_slug):
        queryset = Challenge.objects.select_related('community').filter(community__slug = community_slug)
        if not queryset.exists():
            raise NotFound("Gincanas não encontradas!")
        
        return queryset
    
    def get_challenge_object(self, community_slug, id):
        try:
            object = Challenge.objects.select_related('community').get(community__slug = community_slug, id = id)
        except Challenge.DoesNotExist:
            raise NotFound("Gincana não encontrada!")
        
        return object

    def get_competitor(self, community_slug, id_challenge, id_competitor):
        try:
            object = ChallengeCompetitor.objects.select_related('challenge__community').get(challenge__community__slug = community_slug, challenge = id_challenge, id = id_competitor)
        except ChallengeCompetitor.DoesNotExist:
            raise NotFound("Competidor não encontrado!")
        
        return object
    
class CampaignViewMixin(CommunityViewMixin):
    def get_campaign_queryset(self, community_slug):
        queryset = Campaign.objects.select_related('community').filter(community__slug = community_slug)
        if not queryset.exists():
            raise NotFound("Campanhas não encontradas!")
        
        return queryset
    
    def get_campaign_object(self, community_slug, id):
        try:
            object = Campaign.objects.select_related('community').prefetch_related('participants').get(community__slug = community_slug, id = id)
        except Campaign.DoesNotExist:
            raise NotFound("Campanha não encontrada!")
        
        return object