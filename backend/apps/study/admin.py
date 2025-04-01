from django.contrib import admin
from . import models

@admin.register(models.Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'name') 
    search_fields = ('name',)
    ordering = ('name',)

@admin.register(models.Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'created_at')  
    search_fields = ('title',) 
    list_filter = ('categories',) 
    ordering = ('created_at',)
    filter_horizontal = ('categories',) 

@admin.register(models.LessonCompletion)
class LessonCompletionAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'lesson', 'completed_at')
    search_fields = ('user__username', 'lesson__title')  
    list_filter = ('lesson',) 
    ordering = ('-completed_at',)

@admin.register(models.Achievement)
class AchievementAdmin(admin.ModelAdmin):
    list_display = ("name", "description")  # Exibe nome e descrição na lista
    search_fields = ("name",)  # Permite busca pelo nome da conquista

@admin.register(models.AchievementRule)
class AchievementRuleAdmin(admin.ModelAdmin):
    list_display = ("achievement", "category", "required_lessons")  # Mostra regras na lista
    list_filter = ("category",)  # Adiciona filtro por categoria

@admin.register(models.UserAchievement)
class UserAchievementAdmin(admin.ModelAdmin):
    list_display = ("user", "achievement", "unlocked_at")  # Exibe usuário e conquista
    list_filter = ("achievement", "unlocked_at")  # Filtros por conquista e data
    search_fields = ("user__username", "achievement__name")  