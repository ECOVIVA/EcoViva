from rest_framework import serializers
from apps.users.models import Users
from apps.community.models.events import *

class ChallengeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Gincana
        fields = '__all__'

class ChallengeCompetitorListSerializer(serializers.ListSerializer):
    members = serializers.PrimaryKeyRelatedField(many=True, queryset=Users.objects.all(), required = False)

    class Meta:
        model = GincanaCompetitor
        fields = ['id', 'gincana', 'name', 'points', 'members']

    def validate(self, data):
        gincana = self.context.get('gincana')
        names = [item['name'] for item in data]

        if len(names) != len(set(names)):
            raise serializers.ValidationError(
                "Existem nomes duplicados na lista enviada."
            )

        existentes = GincanaCompetitor.objects.filter(
            gincana=gincana,
            name__in=names
        ).values_list('name', flat=True)

        if existentes:
            raise serializers.ValidationError(
                f"Os seguintes nomes já existem nesta gincana: {', '.join(existentes)}"
            )

        return data
    
class ChallengeCompetitorSerializer(serializers.ModelSerializer):
    members = serializers.PrimaryKeyRelatedField(many=True, queryset=Users.objects.all(), required = False)

    class Meta:
        model = GincanaCompetitor
        list_serializer_class = ChallengeCompetitorListSerializer
        fields = ['id', 'gincana', 'name', 'points', 'members']
    
class ChallengeRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = GincanaRecord
        fields = [
            'id', 'gincana', 'competitor_group', 'registered_by',
            'metal_qty', 'paper_qty', 'plastic_qty', 'glass_qty',
            'collected_at'
        ]

class CampanhaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Campanha
        fields = '__all__'