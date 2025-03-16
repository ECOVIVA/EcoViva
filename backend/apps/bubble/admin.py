from django.contrib import admin
from . import models

# Area responsavel por registrar e configurar os models Bubble e CheckIn, na minha area administrativa

@admin.register(models.Difficulty)
class DifficultyAdmin(admin.ModelAdmin):
    list_display = ('name', 'points_for_activity')  # Exibir na lista do admin
    search_fields = ('name',)  # Adicionar campo de busca por nome
    ordering = ('points_for_activity',)  # Ordenar por pontos para atividade

@admin.register(models.Rank)
class RankAdmin(admin.ModelAdmin):
    list_display = ('id','name', 'difficulty', 'points')  # Exibir na lista do admin
    search_fields = ('name', 'difficulty__name')  # Buscar pelo nome do Rank e dificuldade
    list_filter = ('difficulty',)  # Adicionar filtro por dificuldade
    ordering = ('points',)  # Ordenar pela pontuação

# Registro do model Bubble
@admin.register(models.Bubble)
class BubbleAdmin(admin.ModelAdmin):
    list_display = 'id', 'user', 'progress'
    list_display_links = 'id',
    search_fields = 'id', 'user'
    ordering = '-id',
    
    list_per_page = 10

# Registro do model CheckIn
@admin.register(models.CheckIn)
class CheckInAdmin(admin.ModelAdmin):
    list_display = 'id', 'bubble', 'created_at'
    list_display_links = 'id',
    search_fields = 'id', 'bubble'
    ordering = '-id',
    
    list_per_page = 10