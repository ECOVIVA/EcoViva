from django.contrib import admin
from apps.community.models.community import *
from apps.community.models.threads import *
from apps.community.models.events import *

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
