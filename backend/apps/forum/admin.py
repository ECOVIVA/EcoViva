from django.contrib import admin
from .models import Thread, Post, Tags

"""
    Configuração do Django Admin para gerenciamento dos modelos Thread, Post e Tags.

    - ThreadAdmin: Configuração para visualizar e administrar threads no painel de administração.
    - PostAdmin: Configuração para exibição e controle dos posts dentro de threads.
    - TagsAdmin: Interface para gerenciamento das tags associadas às threads.

    As configurações incluem filtros, pesquisa, preenchimento automático de campos e otimização de queries.
"""

@admin.register(Thread)
class ThreadAdmin(admin.ModelAdmin):
    """
    Configuração da administração de Threads no Django Admin.
    
    - Exibe informações essenciais na lista de threads.
    - Permite busca por título e conteúdo.
    - Adiciona filtros para facilitar a navegação.
    - Preenche automaticamente o slug com base no título.
    """
    list_display = ('id', 'title', 'author', 'created_at', 'updated_at', 'slug')  # Campos visíveis na lista de threads
    search_fields = ('title', 'content')  # Habilita busca pelo título e conteúdo da thread
    list_filter = ('created_at', 'author', 'tags')  # Filtros laterais para data de criação, autor e tags
    list_select_related = ('author',)  # Otimiza consultas carregando os autores das threads antecipadamente
    prepopulated_fields = {'slug': ('title',)}  # Preenche automaticamente o slug com base no título

    fieldsets = (
        (None, {
            'fields': ('title', 'content', 'tags', 'author', 'slug', 'cover')  # Campos principais da thread
        }),
        ('Datas', {
            'fields': ('created_at', "likes"),  # Exibe a data de criação da thread
            'classes': ('collapse',)  # Oculta essa seção por padrão para um layout mais limpo
        }),
    )


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    """
    Configuração da administração de Posts no Django Admin.
    
    - Exibe os principais detalhes dos posts.
    - Permite busca pelo conteúdo dos posts.
    - Adiciona filtros para facilitar a navegação.
    - Melhora a performance com list_select_related.
    """
    list_display = ('id', 'content', 'author', 'thread', 'created_at', 'updated_at')  # Lista de posts
    search_fields = ('content',)  # Habilita pesquisa pelo conteúdo do post
    list_filter = ('created_at', 'author', 'thread', )  # Filtros laterais para organização dos posts
    list_select_related = ('author', 'thread')  # Otimiza consultas carregando os relacionamentos antecipadamente

    fieldsets = (
        (None, {
            'fields': ('content', 'author', 'thread', )  # Campos principais do post
        }),
        ('Datas', {
            'fields': ('created_at', ),  # Exibe datas do post
            'classes': ('collapse',)  # Oculta essa seção por padrão
        }),
    )


@admin.register(Tags)
class TagsAdmin(admin.ModelAdmin):
    """
    Configuração da administração de Tags no Django Admin.
    
    - Exibe as tags cadastradas.
    - Permite busca pelo nome da tag.
    """
    list_display = ('id', 'name')  # Exibe o ID e nome da tag na listagem
    search_fields = ('name',)  # Habilita pesquisa pelo nome da tag
    prepopulated_fields = {'name': ('name',)}  # Sugestão automática do nome da tag

    fieldsets = (
        (None, {
            'fields': ('name',)  # Campo principal para definir o nome da tag
        }),
    )
