from django.contrib import admin
from apps.community.models.community import *
from apps.community.models.threads import *
from apps.community.models.events import *

@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ('id', 'content', 'author', 'thread', 'created_at', 'updated_at')
    search_fields = ('content',)
    list_filter = ('created_at', 'author', 'thread', )
    list_select_related = ('author', 'thread')

    fieldsets = (
        (None, {
            'fields': ('content', 'author', 'thread', )
        }),
        ('Datas', {
            'fields': ('created_at', ),
            'classes': ('collapse',)
        }),
    )