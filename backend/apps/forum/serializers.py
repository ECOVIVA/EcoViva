from rest_framework import serializers
from . import models

"""
    Este arquivo contém os Serializers responsáveis por converter os dados dos modelos
    em JSON e vice-versa, para que possam ser usados nas APIs.

    Este arquivo é o responsavel por criar o serializer de Posts, validar seus dados e fazer suas operações
    com o Banco de Dados.

"""

class PostsSerializer(serializers.ModelSerializer):
    replies = serializers.SerializerMethodField() 

    class Meta:
        model = models.Post
        fields = ['id', 'thread', 'content', 'author', 'created_at', 'updated_at', 'parent_post', 'replies']
        read_only_fields = ['created_at', 'updated_at']

    def get_replies(self, obj):
        """ Retorna todas as respostas de um post """
        replies = models.Post.objects.filter(parent_post=obj)
        return PostsSerializer(replies, many=True).data

class ThreadsSerializer(serializers.ModelSerializer):
    tags = serializers.ListField(child=serializers.CharField(), write_only=True, required = False)
    tags_data = serializers.SerializerMethodField()

    class Meta:
        model = models.Thread
        fields = ['id','cover', 'title', 'content', 'tags', 'tags_data', 'author', 'slug', 'created_at', 'updated_at']
        read_only_fields = ['slug', 'tags_data', 'created_at', 'updated_at']

    def validate_tags(self, value):
        """ Valida e normaliza as tags """
        if not isinstance(value, list):
            raise serializers.ValidationError('As tags devem ser enviadas como uma lista.')

        normalized_tags = list(set(tag.strip().lower() for tag in value if tag.strip()))
        
        if not normalized_tags:
            raise serializers.ValidationError('Pelo menos uma tag válida deve ser informada.')

        return normalized_tags

    def create(self, validated_data):
        """ Gera um slug único e cria tags dinamicamente ao salvar uma nova Thread """
        tags = validated_data.pop('tags', [])  # Extrai as tags do request
        
        thread = super().create(validated_data)  # Cria a Thread
        self.add_tags_to_thread(thread, tags)  # Associa as tags

        return thread

    def update(self, instance, validated_data):
        """ Atualiza o slug se o título for alterado e gerencia tags """
        tags = validated_data.pop('tags', None)
        thread = super().update(instance, validated_data)

        if tags is not None:  # Se tags forem enviadas, atualizar
            thread.tags.clear()
            self.add_tags_to_thread(thread, tags)

        return thread

    def add_tags_to_thread(self, thread, tag_names):
        """ Cria tags se necessário e associa à Thread """
        for tag_name in tag_names:
            tag, _ = models.Tags.objects.get_or_create(name = tag_name)
            thread.tags.add(tag)

    def get_tags_data(self, obj):
        """ Retorna as tags formatadas no GET """
        return [{"id": tag.id, "name": tag.name} for tag in obj.tags.all()]