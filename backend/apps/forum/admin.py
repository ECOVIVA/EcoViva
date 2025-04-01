from django.contrib import admin
from .models import Thread, Post, Tags

@admin.register(Thread)
class ThreadAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'author', 'created_at', 'updated_at', 'slug')  # Exibe o slug na lista de threads
    search_fields = ('title', 'content')  # Permite pesquisa no título e conteúdo
    list_filter = ('created_at', 'author', 'tags')  # Filtros para data de criação, autor e tags
    list_select_related = ('author',)  # Melhorar performance ao acessar dados do autor
    prepopulated_fields = {'slug': ('title',)}  # Preenche o slug automaticamente com o título

    fieldsets = (
        (None, {
            'fields': ('title', 'content', 'tags', 'author', 'slug', 'cover')  # Adiciona o campo slug no formulário
        }),
        ('Datas', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )

@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ('id', 'content', 'author', 'thread', 'parent_post', 'created_at', 'updated_at')
    search_fields = ('content',)
    list_filter = ('created_at', 'author', 'thread', 'parent_post')  # Adicionando 'parent_post' ao filtro
    list_select_related = ('author', 'thread')  # Relacionamentos para melhorar performance

    fieldsets = (
        (None, {
            'fields': ('content', 'author', 'thread', 'parent_post')  # Adicionando 'parent_post' ao formulário
        }),
        ('Datas', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

@admin.register(Tags)
class TagsAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    search_fields = ('name',)
    prepopulated_fields = {'name': ('name',)}  # Sugestão para o nome baseado na tag

    fieldsets = (
        (None, {
            'fields': ('name',)
        }),
    )
