from rest_framework.generics import CreateAPIView, DestroyAPIView, UpdateAPIView, RetrieveAPIView, ListAPIView
from rest_framework.response import Response  
from rest_framework.exceptions import NotFound
from rest_framework import status 

from apps.users.auth.permissions import IsCommunityAdmin, IsCommunityMember
from apps.community.serializers.events import ChallengeSerializer, ChallengeRecordSerializer, ChallengeCompetitorSerializer
from utils.mixins.community_mixins import ChallengeViewMixin

class ChallengeListView(ChallengeViewMixin, ListAPIView):
    permission_classes = [IsCommunityMember]
    serializer_class = ChallengeSerializer
    
    def get_queryset(self, *args, **kwargs):
        community_slug = self.kwargs.get('slug')
        queryset = self.get_challenge_queryset(community_slug)

        self.check_object_permissions(self.request, queryset.first().community)
        return queryset
    
    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

class ChallengeObjectView(ChallengeViewMixin, RetrieveAPIView):
    permission_classes = [IsCommunityMember]
    serializer_class = ChallengeSerializer
    
    def get_object(self):
        community_slug = self.kwargs.get('slug')
        id_challenge = self.kwargs.get('id_challenge')

        object = self.get_challenge_object(community_slug, id_challenge)
        
        self.check_object_permissions(self.request, object.community)
        return object

class ChallengeCreateView(ChallengeViewMixin, CreateAPIView):
    permission_classes = [IsCommunityAdmin]
    serializer_class = ChallengeSerializer
    
    def create(self, request, *args, **kwargs):
        community_slug = self.kwargs.get('slug')
        community = self.get_community_object(community_slug)
        
        self.check_object_permissions(request, community)

        data = request.data.copy() 
        data["created_by"] = request.user.pk
        data['community'] = community.pk

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response({'detail': 'Gincana criada com sucesso!'}, status=status.HTTP_201_CREATED)

class ChallengeDeleteView(ChallengeViewMixin, DestroyAPIView):
    permission_classes = [IsCommunityAdmin]
    serializer_class = ChallengeSerializer
    
    def get_object(self):
        community_slug = self.kwargs.get('slug')
        id_challenge = self.kwargs.get('id_challenge')

        object = self.get_challenge_object(community_slug, id_challenge)
        
        self.check_object_permissions(self.request, object.community)
        return object

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response({'detail': 'Gincana deletada com sucesso!'}, status=status.HTTP_204_NO_CONTENT)  

class ChallengeCompetitorCreateView(ChallengeViewMixin,CreateAPIView):
    permission_classes = [IsCommunityAdmin]
    serializer_class = ChallengeCompetitorSerializer
    
    def create(self, request, *args, **kwargs):
        is_many = isinstance(request.data, list)
        community_slug = self.kwargs.get('slug')
        id_challenge = self.kwargs.get('id_challenge')

        challenge = self.get_challenge_object(community_slug, id_challenge)
        
        self.check_object_permissions(self.request, challenge.community)

        data = request.data.copy()

        if is_many:
            for item in data:
                item['challenge'] = challenge.pk
        else:
            data['challenge'] = challenge.pk

        serializer = self.get_serializer(data=data, many=is_many)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        return Response({'detail': 'Competidor(es) da Gincana registrado(s).'}, status=status.HTTP_201_CREATED)

class ChallengeCompetitorDeleteView(ChallengeViewMixin, DestroyAPIView):
    permission_classes = [IsCommunityAdmin]
    serializer_class = ChallengeCompetitorSerializer
    
    def get_object(self):
        id_challenge = self.kwargs.get('id_challenge')
        id_competitor = self.kwargs.get('id_competitor')
        community_slug = self.kwargs.get('slug')
        
        object = self.get_competitor(community_slug, id_challenge, id_competitor)

        self.check_object_permissions(self.request, object.challenge.community)
        return object

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response({'detail': 'Competidor deletado com sucesso!'}, status=status.HTTP_204_NO_CONTENT)  

class ChallengeRecordCreateView(ChallengeViewMixin,CreateAPIView):
    permission_classes = [IsCommunityAdmin]
    serializer_class = ChallengeRecordSerializer
    
    def create(self, request, *args, **kwargs):
        data = request.data.copy()

        community_slug = self.kwargs.get('slug')
        id_challenge = self.kwargs.get('id_challenge')
        id_competitor = data.get('competitor_group')

        if not id_competitor:
            raise NotFound("ID do competidor não informado.")

        competitor = self.get_competitor(community_slug, id_challenge, id_competitor)
        
        self.check_object_permissions(request, competitor.challenge.community)

        data["registered_by"] = request.user.pk
        data["challenge"] = competitor.challenge.pk

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        return Response({'detail': 'Registro criado com sucesso!'}, status=status.HTTP_201_CREATED)