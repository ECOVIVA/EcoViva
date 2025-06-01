from rest_framework.generics import GenericAPIView
from rest_framework.mixins import ( RetrieveModelMixin, ListModelMixin, CreateModelMixin, DestroyModelMixin,UpdateModelMixin)
from rest_framework.response import Response  
from rest_framework.exceptions import NotFound, PermissionDenied
from rest_framework import status 

from apps.users.auth.permissions import IsCommunityAdmin, IsCommunityMember
from apps.users.serializers import UsersMinimalSerializer
from apps.community.models.events import Campaign, Community
from apps.community.serializers.events import CampaignSerializer

class CampaignCreateView(GenericAPIView, CreateModelMixin):
    permission_classes = [IsCommunityAdmin]
    serializer_class = CampaignSerializer

    def create(self, request, *args, **kwargs):
        community_slug = self.kwargs.get('slug')

        try:
            community = Community.objects.get(slug=community_slug)
        except Community.DoesNotExist:
            raise NotFound("Comunidade não encontrada!")

        self.check_object_permissions(request, community)

        data = request.data.copy()  
        data['created_at'] = request.user.pk
        data['community'] = community.pk
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response({'detail': 'Campanha criada com sucesso!'}, status=status.HTTP_201_CREATED)
    
    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)

class CampaignListView(GenericAPIView, ListModelMixin):
    permission_classes = [IsCommunityMember]
    serializer_class = CampaignSerializer

    def get_queryset(self):
        slug = self.kwargs.get('slug')

        try:
            community = Community.objects.get(slug=slug)
        except Community.DoesNotExist:
            raise NotFound("Comunidade não encontrada!")

        self.check_object_permissions(self.request, community)

        return Campaign.objects.select_related("community").filter(community=community)
        
    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

class CampaignDetailView(GenericAPIView, RetrieveModelMixin):
    permission_classes = [IsCommunityMember]
    serializer_class = CampaignSerializer
    
    def get_object(self):
        community_slug = self.kwargs.get('slug')
        id = self.kwargs.get('id_campaign')

        try:
            campaign = Campaign.objects.select_related('community').get(community__slug = community_slug, id = id)
        except Campaign.DoesNotExist:
            raise NotFound("Campanha não encontrada!")
        
        self.check_object_permissions(self.request , campaign.community)

        return campaign

    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

class CampaignUpdateView(GenericAPIView, UpdateModelMixin):
    permission_classes = [IsCommunityAdmin]
    serializer_class = CampaignSerializer

    def get_object(self):
        community_slug = self.kwargs.get('slug')
        id = self.kwargs.get('id_campaign')

        try:
            campaign = Campaign.objects.select_related('community').get(community__slug = community_slug, id = id)
        except Campaign.DoesNotExist:
            raise NotFound("Campanha não encontrada!")
        
        self.check_object_permissions(self.request,campaign.community)

        return campaign

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response({'detail': "Campanha atualizada com sucesso!"})
    
    def patch(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)

class CampaignDeleteView(GenericAPIView, DestroyModelMixin):
    permission_classes = [IsCommunityAdmin]
    serializer_class = CampaignSerializer

    def get_object(self):
        community_slug = self.kwargs.get('slug')
        id = self.kwargs.get('id_campaign')

        try:
            campaign = Campaign.objects.select_related('community').get(community__slug = community_slug, id = id)
        except Campaign.DoesNotExist:
            raise NotFound("Campanha não encontrada!")
        
        self.check_object_permissions(self.request,campaign.community)

        return campaign

    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)

class ToggleCampaignParticipationView(GenericAPIView, CreateModelMixin):
    permission_classes = [IsCommunityMember]
    serializer_class = CampaignSerializer

    def post(self, request, *args, **kwargs):
        campaign_id = self.kwargs.get('id_campaign')
        slug = self.kwargs.get('slug')
        user = request.user

        try:
            campaign = Campaign.objects.select_related("community").prefetch_related('participants').get(id=campaign_id, community__slug = slug)
        except Campaign.DoesNotExist:
            raise NotFound("Campanha não encontrada.")

        self.check_object_permissions(request, campaign.community)
        is_participant = campaign.participants.filter(id=user.id).exists()

        if is_participant:
            campaign.participants.remove(request.user)
            return Response({'detail': 'Você saiu da campanha.'}, status=status.HTTP_200_OK)

        campaign.participants.add(user)
        return Response({'detail': "Você esta participando da campanha."}, status=status.HTTP_200_OK)

class ListParticipantsView(GenericAPIView, ListModelMixin):
    permission_classes = [IsCommunityMember]
    serializer_class = UsersMinimalSerializer

    def get_queryset(self):    
        id_campaign = self.kwargs.get('id_campaign')
        
        try:
            campaign = Campaign.objects.select_related('community').prefetch_related('participants').get(id = id_campaign)
            self.check_object_permissions(self.request, campaign.community)
            return campaign.participants.all()  
        except Campaign.DoesNotExist:
            raise NotFound("Campanha não encontrada!")

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)