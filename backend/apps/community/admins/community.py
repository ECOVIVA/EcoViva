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