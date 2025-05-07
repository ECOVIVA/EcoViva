from rest_framework import serializers
from apps.users.serializers import UsersSerializer, UsersMinimalSerializer
from apps.users.models import Users
from . import models

"""
    Serializers responsáveis por converter os dados dos modelos em JSON e vice-versa.

    - PostsSerializer:
      Serializa os dados dos posts, incluindo respostas associadas.

    - ThreadsSerializer:
      Serializa os dados das threads, gerenciando tags e garantindo a criação/atualização adequada.
"""

class PostsSerializer(serializers.ModelSerializer):
    author = serializers.PrimaryKeyRelatedField(
        queryset=Users.objects.all(), write_only=True
    )
    thread = serializers.SlugRelatedField(
        slug_field='slug',
        queryset=models.Thread.objects.all()
    )

    class Meta:
        model = models.Post
        fields = ['id', 'thread', 'content', 'author', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']  # Campos que não podem ser alterados manualmente

    def to_representation(self, instance):
        """
        Exibe o autor como objeto completo na resposta (GET).
        """
        rep = super().to_representation(instance)
        rep['author'] = UsersMinimalSerializer(instance.author).data
        return rep

class ThreadReadSerializer(serializers.ModelSerializer):
    author = UsersMinimalSerializer()
    tags = serializers.SlugRelatedField(
        many=True,
        slug_field='name',  
        queryset=models.Tags.objects.all() 
    )
    posts = serializers.SerializerMethodField()
    liked = serializers.SerializerMethodField()
    likes = serializers.SerializerMethodField()

    class Meta:
        model = models.Thread
        fields = [
            'id', 'community', 'cover', 'title', 'content', 'likes', 'liked',
            'tags', 'author', 'slug', 'posts', 'created_at', 'updated_at'
        ]
        read_only_fields = ['slug', 'posts', 'likes', 'liked', 'created_at', 'updated_at']
    
    def get_liked(self, obj):
        # Verifica se o usuário atual curtiu o thread
        request = self.context.get('request')
        user = request.user
        return user in obj.likes.all()
    
    def get_posts(self, instance): 
        posts = instance.posts.all() 
        return PostsSerializer(posts, many=True).data

    def get_likes(self, obj):
        # Conta o número de likes no thread
        return obj.likes.count()

class ThreadWriteSerializer(serializers.ModelSerializer):
    author = serializers.PrimaryKeyRelatedField(queryset=Users.objects.all())
    community = serializers.PrimaryKeyRelatedField(queryset=models.Community.objects.all())
    tags = serializers.ListField(
        child=serializers.CharField(),
        required=False,
        allow_empty=True
    )

    class Meta:
        model = models.Thread
        fields = [
            'id','community', 'cover', 'title', 'content',
            'tags', 'author',
        ]

    def validate_tags(self, value):
        """
        Valida e normaliza as tags recebidas.
        """
        if not isinstance(value, list):
            raise serializers.ValidationError('As tags devem ser uma lista de strings.')

        # Normaliza as tags, removendo espaços e convertendo para minúsculas
        normalized_tags = list(set(tag.strip().lower() for tag in value if tag.strip()))
        return normalized_tags

    def create(self, validated_data):
        tags = validated_data.pop('tags', [])
        thread = super().create(validated_data)
        self.add_tags_to_thread(thread, tags)
        return thread

    def update(self, instance, validated_data):
        tags = validated_data.pop('tags', None)
        thread = super().update(instance, validated_data)
        if tags is not None:
            thread.tags.clear()
            self.add_tags_to_thread(thread, tags)
        return thread

    def add_tags_to_thread(self, thread, tag_names):
        for tag_name in tag_names:
            tag, _ = models.Tags.objects.get_or_create(name=tag_name)
            thread.tags.add(tag)

class CommunitySerializer(serializers.ModelSerializer):
    owner = serializers.PrimaryKeyRelatedField(queryset=Users.objects.all())
    admins = serializers.PrimaryKeyRelatedField(queryset=Users.objects.all(), many=True, required=False)
    pending_requests = serializers.PrimaryKeyRelatedField(queryset=Users.objects.all(), many=True, required=False)
    members = serializers.PrimaryKeyRelatedField(queryset=Users.objects.all(), many=True, required=False)

    class Meta:
        model = models.Community
        fields = [
            'id',
            'name',
            'slug',
            'description',
            'banner',
            'icon',
            'owner',
            'admins',
            'pending_requests',
            'members',
            'created_at',
            'is_private',
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