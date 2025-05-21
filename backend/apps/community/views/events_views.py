from rest_framework.generics import GenericAPIView
from rest_framework.mixins import ( RetrieveModelMixin, ListModelMixin, CreateModelMixin, UpdateModelMixin, DestroyModelMixin)
from rest_framework.response import Response  
from rest_framework.exceptions import NotFound
from rest_framework import status, permissions  

from apps.users.auth.permissions import IsCommunityAdmin, IsCommunityMember, IsCommunityOwner
from apps.community.models.events import *
from apps.community.serializers.events import *

class GincanaListView(GenericAPIView, ListModelMixin):
    permission_classes = [IsCommunityMember]
    serializer_class = GincanaSerializer
    
    def get_queryset(self, *args, **kwargs):
        community_slug = self.kwargs.get('slug')
        queryset = Gincana.objects.select_related('community').filter(community = community_slug)
        if not queryset:
            raise NotFound("Não há Gincanas!")
        return queryset
    
    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

class GincanaObjectView(GenericAPIView, RetrieveModelMixin):
    permission_classes = [IsCommunityMember]
    serializer_class = GincanaSerializer
    
    def get_object(self):
        id = self.kwargs.get('id_gincana')
        try:
            return Gincana.objects.select_related('owner').prefetch_related('admins', 'members').get(id = id)
        except Gincana.DoesNotExist:
            raise NotFound("Gincana não encontrada!")
    
    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

class GincanaCreateView(GenericAPIView, CreateModelMixin):
    permission_classes = [IsCommunityAdmin]
    serializer_class = GincanaSerializer
    
    def create(self, request, *args, **kwargs):
        data = request.data.copy()  

        data["created_by"] = request.user.pk
        data['community'] = self.kwargs.get('slug')

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
        id_gincana = self.kwargs.get('id_gincana')
        try:
            queryset = Gincana.objects.get(id = id_gincana)
            self.check_object_permissions(self.request, queryset)
            return queryset
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
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response({'detail': 'Competidor da Gincana registrado.'}, status=status.HTTP_201_CREATED)
    
    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)

class GincanaCompetitorDeleteView(GenericAPIView, DestroyModelMixin):
    permission_classes = [IsCommunityAdmin]
    serializer_class = GincanaCompetitorSerializer
    
    def get_object(self):
        id = self.kwargs.get('id_gincana')
        name = self.kwargs.get('name')
        try:
            queryset = GincanaCompetitor.objects.get(id = id, name = name)
            self.check_object_permissions(self.request, queryset)
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

        data["registered_by"] = request.user.pk
        data["competitor_group"] = self.kwargs.get('group_id')
        data['gincana'] = self.kwargs.get('gincana_id')

        serializer = self.get_serializer(data=data)
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
            return Gincana.objects.select_related('owner').prefetch_related('admins', 'members').get(id = id)
        except Gincana.DoesNotExist:
            raise NotFound("Registro não encontrado!")
    
    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)