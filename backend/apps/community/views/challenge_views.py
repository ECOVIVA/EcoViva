from rest_framework.generics import GenericAPIView
from rest_framework.mixins import ( RetrieveModelMixin, ListModelMixin, CreateModelMixin, DestroyModelMixin,UpdateModelMixin)
from rest_framework.response import Response  
from rest_framework.exceptions import NotFound, PermissionDenied
from rest_framework import status 

from apps.users.auth.permissions import IsCommunityAdmin, IsCommunityMember, IsCommunityOwner
from apps.community.models.events import Challenge, ChallengeCompetitor, Community
from apps.community.serializers.events import ChallengeSerializer, ChallengeRecordSerializer, ChallengeCompetitorSerializer

class ChallengeListView(GenericAPIView, ListModelMixin):
    permission_classes = [IsCommunityMember]
    serializer_class = ChallengeSerializer
    
    def get_queryset(self, *args, **kwargs):
        community_slug = self.kwargs.get('slug')
    
        try:
            community = Community.objects.get(slug=community_slug)
        except Community.DoesNotExist:
            raise NotFound("Comunidade não encontrada!")

        self.check_object_permissions(self.request, community)

        queryset = Challenge.objects.filter(community=community)
        if not queryset.exists():
            raise NotFound("Não há Gincanas!")

        return queryset
    
    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

class ChallengeObjectView(GenericAPIView, RetrieveModelMixin):
    permission_classes = [IsCommunityMember]
    serializer_class = ChallengeSerializer
    
    def get_object(self):
        community_slug = self.kwargs.get('slug')
        id = self.kwargs.get('id_challenge')

        try:
            object = Challenge.objects.get(community__slug = community_slug, id = id)
        except Challenge.DoesNotExist:
            raise NotFound("Gincana não encontrada!")
        
        self.check_object_permissions(self.request, object.community)
        return object
    
    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

class ChallengeCreateView(GenericAPIView, CreateModelMixin):
    permission_classes = [IsCommunityAdmin]
    serializer_class = ChallengeSerializer
    
    def create(self, request, *args, **kwargs):
        community_slug = self.kwargs.get('slug')

        try:
            community = Community.objects.get(slug=community_slug)
        except Community.DoesNotExist:
            raise NotFound("Comunidade não encontrada!")
        
        self.check_object_permissions(request, community)

        data = request.data.copy() 
        data["created_by"] = request.user.pk
        data['community'] = community.pk

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response({'detail': 'Gincana criada com sucesso!'}, status=status.HTTP_201_CREATED)
    
    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)

class ChallengeDeleteView(GenericAPIView, DestroyModelMixin):
    permission_classes = [IsCommunityAdmin]
    serializer_class = ChallengeSerializer
    
    def get_object(self):
        community_slug = self.kwargs.get('slug')
        id = self.kwargs.get('id_challenge')

        try:
            object = Challenge.objects.get(community__slug = community_slug, id = id)
        except Challenge.DoesNotExist:
            raise NotFound("Gincana não encontrada!")
        
        self.check_object_permissions(self.request, object.community)
        return object

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response({'detail': 'Gincana deletada com sucesso!'}, status=status.HTTP_204_NO_CONTENT)  
    
    def delete(self, request, *args, **kwargs):  
        return self.destroy(request,  *args, **kwargs)

class ChallengeCompetitorCreateView(GenericAPIView, CreateModelMixin):
    permission_classes = [IsCommunityAdmin]
    serializer_class = ChallengeCompetitorSerializer
    
    def create(self, request, *args, **kwargs):
        is_many = isinstance(request.data, list)
        community_slug = self.kwargs.get('slug')
        id = self.kwargs.get('id_challenge')

        try:
            challenge = Challenge.objects.get(community__slug = community_slug, id=id)
        except Challenge.DoesNotExist:
            raise NotFound("Gincana não encontrada!")
        
        self.check_object_permissions(self.request, challenge.community)

        data = request.data.copy()

        if is_many:
            for item in data:
                item['gincana'] = challenge.pk
        else:
            data['gincana'] = challenge.pk

        serializer = self.get_serializer(data=data, many=is_many)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        return Response({'detail': 'Competidor(es) da Gincana registrado(s).'}, status=status.HTTP_201_CREATED)
    
    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)

class ChallengeCompetitorDeleteView(GenericAPIView, DestroyModelMixin):
    permission_classes = [IsCommunityAdmin]
    serializer_class = ChallengeCompetitorSerializer
    
    def get_object(self):
        id_challenge = self.kwargs.get('id_challenge')
        id_competitor = self.kwargs.get('id_competitor')
        community_slug = self.kwargs.get('slug')
        
        try:
            object = ChallengeCompetitor.objects.get(gincana__community__slug = community_slug, gincana = id_challenge, id = id_competitor)
        except ChallengeCompetitor.DoesNotExist:
            raise NotFound("Competidor não encontrado!")
        
        self.check_object_permissions(self.request, object.gincana.community)
        return object

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response({'detail': 'Competidor deletado com sucesso!'}, status=status.HTTP_204_NO_CONTENT)  
    
    def delete(self, request, *args, **kwargs):  
        return self.destroy(request,  *args, **kwargs)

class ChallengeRecordCreateView(GenericAPIView, CreateModelMixin):
    permission_classes = [IsCommunityAdmin]
    serializer_class = ChallengeRecordSerializer
    
    def create(self, request, *args, **kwargs):
        is_many = isinstance(request.data, list)
        data = request.data.copy()  

        id_competitor = self.request.data.get('competitor_group')

        try:
            competitor = ChallengeCompetitor.objects.get(id = id_competitor)
        except ChallengeCompetitor.DoesNotExist:
            raise NotFound("Competidor não encontrado!")
        
        self.check_object_permissions(request, competitor.gincana.community)

        data["registered_by"] = request.user.pk
        data['gincana'] = competitor.gincana.pk

        serializer = self.get_serializer(data=data, many = is_many)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response({'detail': 'Registro criado com sucesso!'}, status=status.HTTP_201_CREATED)
    
    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)