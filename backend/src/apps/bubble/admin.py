from apps.bubble.models.bubble import Bubble, Difficulty, Rank
from apps.bubble.models.checkin import CheckIn
from django.contrib import admin


@admin.register(Difficulty)
class DifficultyAdmin(admin.ModelAdmin):  # type: ignore
    list_display = ("name", "points_for_activity")
    search_fields = ("name",)
    ordering = ("points_for_activity",)


@admin.register(Rank)
class RankAdmin(admin.ModelAdmin):  # type: ignore
    list_display = ("id", "name", "difficulty", "points")
    search_fields = ("name", "difficulty__name")
    list_filter = ("difficulty",)
    ordering = ("points",)


@admin.register(Bubble)
class BubbleAdmin(admin.ModelAdmin):  # type: ignore
    list_display = ("id", "user", "progress")
    list_display_links = ("id",)
    search_fields = ("id", "user")
    ordering = ("-id",)
    list_per_page = 10


@admin.register(CheckIn)
class CheckInAdmin(admin.ModelAdmin):  # type: ignore
    list_display = ("id", "bubble", "created_at")
    list_display_links = ("id",)
    search_fields = ("id", "bubble")
    ordering = ("-id",)
    list_per_page = 10
