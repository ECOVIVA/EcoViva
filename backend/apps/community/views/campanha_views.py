from rest_framework.generics import GenericAPIView
from rest_framework.mixins import ( RetrieveModelMixin, ListModelMixin, CreateModelMixin, DestroyModelMixin,UpdateModelMixin)
from rest_framework.response import Response  
from rest_framework.exceptions import NotFound, PermissionDenied
from rest_framework import status 

from apps.users.auth.permissions import IsCommunityAdmin, IsCommunityMember, IsCommunityOwner
from apps.community.models.events import *
from apps.community.serializers.events import *

class CampanhaCreateView(GenericAPIView, CreateModelMixin):
    permission_classes = [IsCommunityAdmin]
    serializer_class = CampanhaSerializer

    def create(self, request, *args, **kwargs):
        data = request.data.copy()  
        data['created_at'] = request.user.pk
        community_slug = self.kwargs.get('slug')

        try:
            community = Community.objects.get(slug=community_slug)
        except Community.DoesNotExist:
            raise NotFound("Comunidade não encontrada!")

        self.check_object_permissions(request, community)

        serializer = self.get_serializer(data=data, many = True)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response({'detail': 'Registro criado com sucesso!'}, status=status.HTTP_201_CREATED)
    
    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)

class CampanhaListView(GenericAPIView, ListModelMixin):
    permission_classes = [IsCommunityMember]
    serializer_class = CampanhaSerializer
    queryset = Campanha.objects.all()

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

class CampanhaDetailView(GenericAPIView, RetrieveModelMixin):
    permission_classes = [IsCommunityMember]
    serializer_class = CampanhaSerializer
    lookup_url_kwarg = 'campanha_id'

    def get_queryset(self):
        return Campanha.objects.all()

    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

class CampanhaUpdateView(GenericAPIView, UpdateModelMixin):
    permission_classes = [IsCommunityAdmin]
    serializer_class = CampanhaSerializer
    lookup_url_kwarg = 'campanha_id'

    def get_queryset(self):
        return Campanha.objects.all()

    def patch(self, request, *args, **kwargs):
        campanha = self.get_object()
        if campanha.created_by != request.user:
            raise PermissionDenied("Você não tem permissão para editar essa campanha.")
        return self.partial_update(request, *args, **kwargs)


class CampanhaDeleteView(GenericAPIView, DestroyModelMixin):
    permission_classes = [IsCommunityAdmin]
    serializer_class = CampanhaSerializer
    lookup_url_kwarg = 'campanha_id'

    def get_queryset(self):
        return Campanha.objects.all()

    def delete(self, request, *args, **kwargs):
        campanha = self.get_object()
        if campanha.owner != request.user:
            raise PermissionDenied("Você não tem permissão para excluir essa campanha.")
        return self.destroy(request, *args, **kwargs)

class ToggleCampanhaParticipationView(GenericAPIView, CreateModelMixin):
    permission_classes = [IsCommunityMember]
    serializer_class = CampanhaSerializer
    lookup_url_kwarg = 'campanha_id'

    def post(self, request, *args, **kwargs):
        campanha_id = self.kwargs.get(self.lookup_url_kwarg)
        user = request.user

        try:
            campanha = Campanha.objects.get(id=campanha_id)
        except Campanha.DoesNotExist:
            raise NotFound("Campanha não encontrada.")

        participant = Campanha.objects.filter(campanha=campanha, user=user).first()

        if participant:
            participant.delete()
            return Response({'detail': 'Você saiu da campanha.'}, status=status.HTTP_200_OK)

        new_participant = Campanha.objects.create(campanha=campanha, user=user)
        serializer = self.get_serializer(new_participant)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class ListParticipantsView(GenericAPIView, ListModelMixin):
    permission_classes = [IsCommunityMember]
    serializer_class = CampanhaSerializer
    lookup_url_kwarg = 'campanha_id'

    def get_queryset(self):
        campanha_id = self.kwargs.get(self.lookup_url_kwarg)
        try:
            campanha = Campanha.objects.get(id=campanha_id)
        except Campanha.DoesNotExist:
            raise NotFound("Campanha não encontrada.")
        return Campanha.objects.filter(campanha=campanha)

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)