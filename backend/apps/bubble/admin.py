from django.contrib import admin
from . import models

# Registra e configura os models para visualização na área administrativa

@admin.register(models.Difficulty)
class DifficultyAdmin(admin.ModelAdmin):
    list_display = ('name', 'points_for_activity')  # Exibe nome e pontos de atividade
    search_fields = ('name',)  # Permite busca pelo nome
    ordering = ('points_for_activity',)  # Ordena por pontos

@admin.register(models.Rank)
class RankAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'difficulty', 'points')  # Exibe id, nome, dificuldade e pontos
    search_fields = ('name', 'difficulty__name')  # Permite busca por nome e dificuldade
    list_filter = ('difficulty',)  # Filtro por dificuldade
    ordering = ('points',)  # Ordena por pontos

# Configuração do model Bubble no admin
@admin.register(models.Bubble)
class BubbleAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'progress')  # Exibe ID, usuário e progresso
    list_display_links = ('id',)  # Permite clicar no ID para acessar detalhes
    search_fields = ('id', 'user')  # Permite busca por ID e usuário
    ordering = ('-id',)  # Ordena pela ID em ordem decrescente
    list_per_page = 10  # Exibe 10 itens por página

# Configuração do model CheckIn no admin
@admin.register(models.CheckIn)
class CheckInAdmin(admin.ModelAdmin):
    list_display = ('id', 'bubble', 'created_at')  # Exibe ID, bolha e data de criação
    list_display_links = ('id',)  # Permite clicar no ID para acessar detalhes
    search_fields = ('id', 'bubble')  # Permite busca por ID e bolha
    ordering = ('-id',)  # Ordena pela ID em ordem decrescente
    list_per_page = 10  # Exibe 10 itens por página
