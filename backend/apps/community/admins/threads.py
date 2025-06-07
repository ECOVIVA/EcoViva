from django.contrib import admin
from apps.community.models.community import *
from apps.community.models.threads import *
from apps.community.models.events import *

@admin.register(Thread)
class ThreadAdmin(admin.ModelAdmin):
    list_display = ('id','community__name', 'title', 'author', 'created_at', 'updated_at', 'slug')
    search_fields = ('title', 'content')
    list_filter = ('created_at','community__name', 'author', 'tags')
    list_select_related = ('author',)
    prepopulated_fields = {'slug': ('title',)}

    fieldsets = (
        (None, {
            'fields': ('title','community', 'content', 'tags', 'author', 'slug', 'cover')
        }),
        ('Datas', {
            'fields': ('created_at', "likes"),
            'classes': ('collapse',)
        }),
    )

@admin.register(Tags)
class TagsAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    search_fields = ('name',)
    prepopulated_fields = {'name': ('name',)}

    fieldsets = (
        (None, {
            'fields': ('name',)
        }),
    )