from django.contrib import admin
from apps.community.models.community import *
from apps.community.models.threads import *
from apps.community.models.events import *

@admin.register(Community)
class CommunityAdmin(admin.ModelAdmin):
    list_display = ('name', 'owner', 'is_private', 'created_at')
    list_filter = ('is_private', 'created_at')
    search_fields = ('name', 'description', 'owner__username')
    readonly_fields = ('created_at',)
    prepopulated_fields = {'slug': ('name',)}
    filter_horizontal = ('admins', 'pending_requests', 'members')

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

@admin.register(Challenge)
class ChallengeAdmin(admin.ModelAdmin):
    list_display = ('title', 'community', 'deadline', 'created_at')
    search_fields = ('title',)
    list_filter = ('community', 'deadline')

@admin.register(ChallengeCompetitor)
class ChallengeCompetitorAdmin(admin.ModelAdmin):
    list_display = ('name', 'challenge', 'points')
    search_fields = ('name',)
    list_filter = ('challenge',)
    filter_horizontal = ('members',)

@admin.register(ChallengeRecord)
class ChallengeRecordAdmin(admin.ModelAdmin):
    list_display = ('competitor_group', 'registered_by', 'collected_at')
    list_filter = ('collected_at',)
    search_fields = ('competitor_group__name',)

@admin.register(Campaign)
class CampanhaAdmin(admin.ModelAdmin):
    list_display = ('title', 'community', 'deadline', 'created_at')
    search_fields = ('title',)
    list_filter = ('community', 'deadline')