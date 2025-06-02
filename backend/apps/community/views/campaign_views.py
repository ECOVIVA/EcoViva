from rest_framework.generics import  CreateAPIView, RetrieveAPIView, ListAPIView, UpdateAPIView, DestroyAPIView
from rest_framework.response import Response  
from rest_framework.exceptions import NotFound
from rest_framework import status 
from django.db.models.query import QuerySet

from apps.users.auth.permissions import IsCommunityAdmin, IsCommunityMember
from apps.users.serializers import UsersMinimalSerializer
from apps.community.models.events import Campaign, Community
from apps.community.serializers.events import CampaignSerializer

class CampaignViewMixin:
    def get_community(self, community_slug):
        try:
            community = Community.objects.get(slug=community_slug)
        except Community.DoesNotExist:
            raise NotFound("Comunidade não encontrada!")
        
        return community
    
    def get_campaign_queryset(self, community_slug) -> QuerySet[Campaign]:
        queryset = Campaign.objects.select_related('community').filter(community__slug = community_slug)
        if not queryset.exists():
            raise NotFound("Campanhas não encontradas!")
        
        return queryset
    
    def get_campaign_object(self, community_slug, id) -> Campaign:
        try:
            object = Campaign.objects.select_related('community').prefetch_related('participants').get(community__slug = community_slug, id = id)
        except Campaign.DoesNotExist:
            raise NotFound("Campanha não encontrada!")
        
        return object

class CampaignCreateView(CreateAPIView, CampaignViewMixin):
    permission_classes = [IsCommunityAdmin]
    serializer_class = CampaignSerializer

    def create(self, request, *args, **kwargs):
        community_slug = self.kwargs.get('slug')

        community = self.get_community(community_slug)
        self.check_object_permissions(request, community)

        data = request.data.copy()  
        data['created_at'] = request.user.pk
        data['community'] = community.pk
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response({'detail': 'Campanha criada com sucesso!'}, status=status.HTTP_201_CREATED)

class CampaignListView(CampaignViewMixin, ListAPIView):
    permission_classes = [IsCommunityMember]
    serializer_class = CampaignSerializer

    def get_queryset(self):
        community_slug = self.kwargs.get('slug')
        queryset = self.get_campaign_queryset(community_slug)
        self.check_object_permissions(self.request, queryset.first().community)

        return queryset

class CampaignDetailView(CampaignViewMixin, RetrieveAPIView):
    permission_classes = [IsCommunityMember]
    serializer_class = CampaignSerializer
    
    def get_object(self):
        community_slug = self.kwargs.get('slug')
        id = self.kwargs.get('id_campaign')
        campaign = self.get_campaign_object(community_slug, id)
        self.check_object_permissions(self.request , campaign.community)

        return campaign

class CampaignUpdateView(CampaignViewMixin, UpdateAPIView):
    permission_classes = [IsCommunityAdmin]
    serializer_class = CampaignSerializer

    def get_object(self):
        community_slug = self.kwargs.get('slug')
        id = self.kwargs.get('id_campaign')
        campaign = self.get_campaign_object(community_slug, id)

        self.check_object_permissions(self.request,campaign.community)
        return campaign

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response({'detail': "Campanha atualizada com sucesso!"})

class CampaignDeleteView(CampaignViewMixin, DestroyAPIView):
    permission_classes = [IsCommunityAdmin]
    serializer_class = CampaignSerializer

    def get_object(self):
        community_slug = self.kwargs.get('slug')
        id = self.kwargs.get('id_campaign')
        campaign = self.get_campaign_object(community_slug, id)
        
        self.check_object_permissions(self.request,campaign.community)
        return campaign

class ToggleCampaignParticipationView(CampaignViewMixin, CreateAPIView):
    permission_classes = [IsCommunityMember]
    serializer_class = CampaignSerializer

    def post(self, *args, **kwargs):
        id = self.kwargs.get('id_campaign')
        community_slug = self.kwargs.get('slug')
        campaign = self.get_campaign_object(community_slug, id)

        self.check_object_permissions(self.request, campaign.community)
        is_participant = campaign.participants.filter(id=self.request.user.id).exists()

        if is_participant:
            campaign.participants.remove(self.request.user)
            return Response({'detail': 'Você saiu da campanha.'}, status=status.HTTP_200_OK)

        campaign.participants.add(self.request.user)
        return Response({'detail': "Você esta participando da campanha."}, status=status.HTTP_200_OK)

class ListParticipantsView(CampaignViewMixin, ListAPIView):
    permission_classes = [IsCommunityMember]
    serializer_class = UsersMinimalSerializer

    def get_queryset(self):    
        community_slug = self.kwargs.get('slug')
        id_campaign = self.kwargs.get('id_campaign')
        campaign = self.get_campaign_object(community_slug, id_campaign)

        self.check_object_permissions(self.request, campaign.community)
        
        return campaign.participants.all()