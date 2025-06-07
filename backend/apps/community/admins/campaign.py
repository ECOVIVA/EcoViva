from django.contrib import admin
from apps.community.models.community import *
from apps.community.models.threads import *
from apps.community.models.events import *

@admin.register(Campaign)
class CampaignAdmin(admin.ModelAdmin):
    list_display = ('title', 'community', 'deadline', 'created_at')
    search_fields = ('title',)
    list_filter = ('community', 'deadline')