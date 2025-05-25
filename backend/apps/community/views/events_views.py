from rest_framework.generics import GenericAPIView
from rest_framework.mixins import ( RetrieveModelMixin, ListModelMixin, CreateModelMixin, UpdateModelMixin, DestroyModelMixin)
from rest_framework.response import Response  
from rest_framework.exceptions import NotFound
from rest_framework import status 

from apps.users.auth.permissions import IsCommunityAdmin, IsCommunityMember, IsCommunityOwner
from apps.community.models.events import *
from apps.community.serializers.events import *

class GincanaListView(GenericAPIView, ListModelMixin):
    permission_classes = [IsCommunityMember]
    serializer_class = GincanaSerializer
    
    def get_queryset(self, *args, **kwargs):
        community_slug = self.kwargs.get('slug')
    
        try:
            community = Community.objects.get(slug=community_slug)
        except Community.DoesNotExist:
            raise NotFound("Comunidade não encontrada!")

        self.check_object_permissions(self.request, community)

        queryset = Gincana.objects.filter(community=community)
        if not queryset.exists():
            raise NotFound("Não há Gincanas!")

        return queryset
    
    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

class GincanaObjectView(GenericAPIView, RetrieveModelMixin):
    permission_classes = [IsCommunityMember]
    serializer_class = GincanaSerializer
    
    def get_object(self):
        community_slug = self.kwargs.get('slug')
        id = self.kwargs.get('id_gincana')

        try:
            community = Community.objects.get(slug=community_slug)
        except Community.DoesNotExist:
            raise NotFound("Comunidade não encontrada!")

        self.check_object_permissions(self.request, community)

        try:
            return Gincana.objects.get(community = community, id = id)
        except Gincana.DoesNotExist:
            raise NotFound("Gincana não encontrada!")
    
    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

class GincanaCreateView(GenericAPIView, CreateModelMixin):
    permission_classes = [IsCommunityAdmin]
    serializer_class = GincanaSerializer
    
    def create(self, request, *args, **kwargs):
        data = request.data.copy() 

        community_slug = self.kwargs.get('slug')

        try:
            community = Community.objects.get(slug=community_slug)
        except Community.DoesNotExist:
            raise NotFound("Comunidade não encontrada!")
        
        self.check_object_permissions(request, community )

        data["created_by"] = request.user.pk
        data['community'] = community.pk

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response({'detail': 'Gincana criada com sucesso!'}, status=status.HTTP_201_CREATED)
    
    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)

class GincanaDeleteView(GenericAPIView, DestroyModelMixin):
    permission_classes = [IsCommunityAdmin]
    serializer_class = GincanaSerializer
    
    def get_object(self):
        community_slug = self.kwargs.get('slug')
        id = self.kwargs.get('id_gincana')

        try:
            community = Community.objects.get(slug=community_slug)
        except Community.DoesNotExist:
            raise NotFound("Comunidade não encontrada!")

        self.check_object_permissions(self.request, community)

        try:
            return Gincana.objects.get(community = community, id = id)
        except Gincana.DoesNotExist:
            raise NotFound("Gincana não encontrada!")

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response({'detail': 'Gincana deletada com sucesso!'}, status=status.HTTP_204_NO_CONTENT)  
    
    def delete(self, request, *args, **kwargs):  
        return self.destroy(request,  *args, **kwargs)

class GincanaCompetitorCreateView(GenericAPIView, CreateModelMixin):
    permission_classes = [IsCommunityAdmin]
    serializer_class = GincanaCompetitorSerializer
    
    def create(self, request, *args, **kwargs):
        is_many = isinstance(request.data, list)

        community_slug = self.kwargs.get('slug')
        id = self.kwargs.get('id_gincana')

        try:
            community = Community.objects.get(slug=community_slug)
        except Community.DoesNotExist:
            raise NotFound("Comunidade não encontrada!")

        self.check_object_permissions(self.request, community)

        try:
            gincana = Gincana.objects.get(community=community, id=id)
        except Gincana.DoesNotExist:
            raise NotFound("Gincana não encontrada!")

        data = request.data.copy()

        if is_many:
            for item in data:
                item['gincana'] = gincana.pk
        else:
            data['gincana'] = gincana.pk

        serializer = self.get_serializer(data=data, many=is_many)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        return Response({'detail': 'Competidor(es) da Gincana registrado(s).'}, status=status.HTTP_201_CREATED)

    
    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)

class GincanaCompetitorDeleteView(GenericAPIView, DestroyModelMixin):
    permission_classes = [IsCommunityAdmin]
    serializer_class = GincanaCompetitorSerializer
    
    def get_object(self):
        id = self.kwargs.get('id_gincana')
        name = self.kwargs.get('name')
        community_slug = self.kwargs.get('slug')

        try:
            community = Community.objects.get(slug=community_slug)
        except Community.DoesNotExist:
            raise NotFound("Comunidade não encontrada!")

        try:
            gincana = Gincana.objects.get(community=community, id=id)
        except Gincana.DoesNotExist:
            raise NotFound("Gincana não encontrada!")
        
        self.check_object_permissions(self.request, community)
        
        try:
            queryset = GincanaCompetitor.objects.get(gincana = gincana, name = name)
            return queryset
        except GincanaCompetitor.DoesNotExist:
            raise NotFound("Competidor não encontrado!")

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response({'detail': 'Competidor deletado com sucesso!'}, status=status.HTTP_204_NO_CONTENT)  
    
    def delete(self, request, *args, **kwargs):  
        return self.destroy(request,  *args, **kwargs)

class GincanaRecordCreateView(GenericAPIView, CreateModelMixin):
    permission_classes = [IsCommunityAdmin]
    serializer_class = GincanaRecordSerializer
    
    def create(self, request, *args, **kwargs):
        data = request.data.copy()  

        community_slug = self.kwargs.get('slug')
        id = self.kwargs.get('id_gincana')
        name = self.kwargs.get('name')

        try:
            community = Community.objects.get(slug=community_slug)
        except Community.DoesNotExist:
            raise NotFound("Comunidade não encontrada!")

        self.check_object_permissions(request, community)

        try:
            gincana = Gincana.objects.get(community=community, id=id)
        except Gincana.DoesNotExist:
            raise NotFound("Gincana não encontrada!")
        
        try:
            competitor = GincanaCompetitor.objects.get(gincana = gincana, name = name)
        except GincanaCompetitor.DoesNotExist:
            raise NotFound("Competidor não encontrado!")
        
        data["registered_by"] = request.user.pk
        data["competitor_group"] = competitor.pk
        data['gincana'] = gincana.pk

        serializer = self.get_serializer(data=data, many = True)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response({'detail': 'Registro criado com sucesso!'}, status=status.HTTP_201_CREATED)
    
    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)
    
class GincanaRecordObjectView(GenericAPIView, RetrieveModelMixin):
    permission_classes = [IsCommunityAdmin]
    serializer_class = GincanaRecordSerializer
    
    def get_object(self):
        id = self.kwargs.get('id_gincana')
        try:
            return GincanaRecord.objects.get(id = id)
        except GincanaRecord.DoesNotExist:
            raise NotFound("Registro não encontrado!")
    
    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)