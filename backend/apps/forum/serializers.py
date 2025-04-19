from rest_framework import serializers
from apps.users.serializers import UsersSerializer
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
        rep['author'] = UsersSerializer(instance.author).data
        return rep

class ThreadsSerializer(serializers.ModelSerializer):
    author = serializers.PrimaryKeyRelatedField(queryset=Users.objects.all())
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
        fields = ['id', 'cover', 'title', 'content','likes', 'liked', 'tags', 'author', 'slug','posts', 'created_at', 'updated_at']
        read_only_fields = ['slug','posts', 'likes', 'liked','created_at', 'updated_at']  # Slug e timestamps não podem ser alterados manualmente

    def to_representation(self, instance):
        """
        Altera a representação da resposta (GET) para incluir o autor detalhado.
        """
        rep = super().to_representation(instance)
        rep['author'] = UsersSerializer(instance.author).data  # substitui o id pelo objeto serializado
        return rep
    
    def get_posts(self, instance): 
        posts = instance.posts.all() 
        return PostsSerializer(posts, many=True).data
    
    def get_liked(self, obj):
        request = self.context.get('request')
        user = request.user
        
        return user in obj.likes.all()

    def get_likes(self, obj):
        return obj.likes.count()
    
    def validate_tags(self, value):
        """ 
        Valida e normaliza as tags recebidas. 
        
        - Garante que seja uma lista.
        - Remove espaços extras e converte para minúsculas.
        - Remove duplicatas.
        - Exige pelo menos uma tag válida.
        """
        if not isinstance(value, list):
            raise serializers.ValidationError('As tags devem ser enviadas como uma lista.')

        normalized_tags = list(set(tag.strip().lower() for tag in value if tag.strip()))

        if not normalized_tags:
            raise serializers.ValidationError('Pelo menos uma tag válida deve ser informada.')

        return normalized_tags

    def create(self, validated_data):
        """ 
        Cria uma nova Thread e associa as tags informadas. 
        
        - Extrai as tags do request.
        - Cria a Thread com os demais dados.
        - Associa as tags criadas ou existentes à Thread.
        """
        tags = validated_data.pop('tags', [])  # Remove as tags antes de criar a Thread

        thread = super().create(validated_data)  # Cria a Thread no banco de dados
        self.add_tags_to_thread(thread, tags)  # Adiciona as tags à Thread

        return thread

    def update(self, instance, validated_data):
        """ 
        Atualiza os dados da Thread, gerenciando alterações no slug e nas tags. 
        
        - Se o título for alterado, o slug também será atualizado.
        - Se novas tags forem enviadas, as antigas serão removidas e substituídas.
        """
        tags = validated_data.pop('tags', None)  # Remove as tags do request
        thread = super().update(instance, validated_data)  # Atualiza os demais campos da Thread

        if tags is not None:  # Se novas tags forem enviadas, atualizar as tags associadas
            thread.tags.clear()  # Remove todas as tags atuais
            self.add_tags_to_thread(thread, tags)  # Adiciona as novas tags

        return thread

    def add_tags_to_thread(self, thread, tag_names):
        """ 
        Associa tags à Thread, criando novas se necessário. 
        
        Para cada tag enviada:
        - Busca a tag no banco de dados.
        - Se não existir, cria uma nova.
        - Associa a tag à Thread.
        """
        for tag_name in tag_names:
            tag, _ = models.Tags.objects.get_or_create(name=tag_name)  # Busca ou cria a tag
            thread.tags.add(tag)  # Associa a tag à Thread
