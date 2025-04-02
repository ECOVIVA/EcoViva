from rest_framework import serializers
from . import models

"""
    Serializers responsáveis por converter os dados dos modelos em JSON e vice-versa.

    - PostsSerializer:
      Serializa os dados dos posts, incluindo respostas associadas.

    - ThreadsSerializer:
      Serializa os dados das threads, gerenciando tags e garantindo a criação/atualização adequada.
"""

class PostsSerializer(serializers.ModelSerializer):
    replies = serializers.SerializerMethodField()  # Campo para armazenar as respostas do post

    class Meta:
        model = models.Post
        fields = ['id', 'thread', 'content', 'author', 'created_at', 'updated_at', 'parent_post', 'replies']
        read_only_fields = ['created_at', 'updated_at']  # Campos que não podem ser alterados manualmente

    def get_replies(self, obj):
        """ 
        Retorna todas as respostas de um post específico.
        
        Filtra os posts que têm o post atual como 'parent_post' e serializa esses dados.
        """
        replies = models.Post.objects.filter(parent_post=obj)
        return PostsSerializer(replies, many=True).data  # Serializa todas as respostas


class ThreadsSerializer(serializers.ModelSerializer):
    tags = serializers.ListField(child=serializers.CharField(), write_only=True, required=False)  # Permite enviar tags como lista no request
    tags_data = serializers.SerializerMethodField()  # Campo somente leitura para exibir tags associadas

    class Meta:
        model = models.Thread
        fields = ['id', 'cover', 'title', 'content', 'tags', 'tags_data', 'author', 'slug', 'created_at', 'updated_at']
        read_only_fields = ['slug', 'tags_data', 'created_at', 'updated_at']  # Slug e timestamps não podem ser alterados manualmente

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

    def get_tags_data(self, obj):
        """ 
        Retorna as tags da Thread formatadas para exibição. 
        
        Exemplo de saída:
        [
            {"id": 1, "name": "python"},
            {"id": 2, "name": "django"}
        ]
        """
        return [{"id": tag.id, "name": tag.name} for tag in obj.tags.all()]
