from rest_framework import serializers
from apps.users.serializers import UsersSerializer, UsersMinimalSerializer
from apps.users.models import Users
from models.community import Community

class CommunitySerializer(serializers.ModelSerializer):
    owner = serializers.PrimaryKeyRelatedField(queryset=Users.objects.all())
    admins = serializers.PrimaryKeyRelatedField(queryset=Users.objects.all(), many=True, required=False)
    pending_requests = serializers.PrimaryKeyRelatedField(queryset=Users.objects.all(), many=True, required=False)
    members = serializers.PrimaryKeyRelatedField(queryset=Users.objects.all(), many=True, required=False)
    members_count = serializers.SerializerMethodField()

    class Meta:
        model = Community
        fields = [
            'id','name','slug','description',
            'banner','icon','owner','admins',
            'pending_requests','members','members_count',
            'created_at','is_private',
        ]
        read_only_fields = ['slug', 'created_at']

    def validate(self, attrs):
        admins = attrs.get('admins', [])
        members = attrs.get('members', [])

        errors = {}

        for admin in admins:
            if admin not in members:
                errors.setdefault('admins', []).append(
                    f"O usuário {admin} deve ser um membro da comunidade antes de ser admin."
                )

        if attrs.get('is_private'):
            pending_requests = attrs.get('pending_requests', [])
            for member in members:
                if member not in pending_requests:
                    errors.setdefault('members', []).append(
                        f"O usuário {member} precisa ter solicitado entrada na comunidade privada."
                    )

        if errors:
            raise serializers.ValidationError(errors)

        return attrs

    def get_members_count(self, obj):
        return obj.members.count()