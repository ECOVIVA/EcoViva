from rest_framework.generics import  CreateAPIView, RetrieveAPIView, ListAPIView, UpdateAPIView, DestroyAPIView
from rest_framework.response import Response  
from rest_framework import status 

from apps.users.auth.permissions import IsCommunityAdmin, IsCommunityMember
from apps.users.serializers import UsersMinimalSerializer
from apps.community.serializers.events import CampaignSerializer
from utils.mixins.community_mixins import CampaignViewMixin

class CampaignCreateView(CreateAPIView, CampaignViewMixin):
    permission_classes = [IsCommunityAdmin]
    serializer_class = CampaignSerializer

    def create(self, request, *args, **kwargs):
        community_slug = self.kwargs.get('slug')

        community = self.get_community_object(community_slug)
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