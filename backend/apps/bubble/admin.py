from django.contrib import admin
from . import models

"""
    Configuração do Django Admin para gerenciamento dos modelos:

    - DifficultyAdmin: Configuração do modelo de dificuldade, permitindo visualização e pesquisa.
    - RankAdmin: Administração dos ranks, com filtros e ordenação por pontos.
    - BubbleAdmin: Exibição e organização das bolhas associadas aos usuários.
    - CheckInAdmin: Gerenciamento dos check-ins, permitindo busca e ordenação.
"""

# Configuração do modelo Difficulty no Django Admin
@admin.register(models.Difficulty)
class DifficultyAdmin(admin.ModelAdmin):
    """
    Administração do modelo Difficulty.
    
    - Exibe nome e pontos associados à dificuldade.
    - Permite busca pelo nome da dificuldade.
    - Ordena a listagem com base nos pontos por atividade.
    """
    list_display = ('name', 'points_for_activity')  # Exibe nome e pontos de atividade
    search_fields = ('name',)  # Permite busca pelo nome
    ordering = ('points_for_activity',)  # Ordena por pontos de atividade

# Configuração do modelo Rank no Django Admin
@admin.register(models.Rank)
class RankAdmin(admin.ModelAdmin):
    """
    Administração do modelo Rank.
    
    - Exibe informações do rank, incluindo nome, dificuldade e pontos.
    - Permite busca pelo nome e pela dificuldade associada.
    - Adiciona um filtro para visualizar ranks por nível de dificuldade.
    - Ordena a listagem com base nos pontos necessários para alcançar o rank.
    """
    list_display = ('id', 'name', 'difficulty', 'points')  # Exibe ID, nome, dificuldade e pontos
    search_fields = ('name', 'difficulty__name')  # Permite busca por nome do rank e nome da dificuldade
    list_filter = ('difficulty',)  # Adiciona filtro por dificuldade
    ordering = ('points',)  # Ordena os ranks pelo número de pontos necessários

# Configuração do modelo Bubble no Django Admin
@admin.register(models.Bubble)
class BubbleAdmin(admin.ModelAdmin):
    """
    Administração do modelo Bubble.
    
    - Exibe ID, usuário e progresso na listagem.
    - Permite pesquisa por ID e usuário associado à bolha.
    - Ordena as bolhas por ID em ordem decrescente.
    - Define paginação para exibir até 10 bolhas por página.
    """
    list_display = ('id', 'user', 'progress')  # Exibe ID, usuário e progresso
    list_display_links = ('id',)  # Torna o ID clicável para edição
    search_fields = ('id', 'user')  # Permite busca por ID e usuário
    ordering = ('-id',)  # Ordena pela ID em ordem decrescente
    list_per_page = 10  # Define limite de 10 itens por página

# Configuração do modelo CheckIn no Django Admin
@admin.register(models.CheckIn)
class CheckInAdmin(admin.ModelAdmin):
    """
    Administração do modelo CheckIn.
    
    - Exibe ID, bolha associada e data de criação.
    - Permite busca por ID e bolha.
    - Ordena os check-ins por ID em ordem decrescente.
    - Define paginação para exibir até 10 check-ins por página.
    """
    list_display = ('id', 'bubble', 'created_at')  # Exibe ID, bolha e data de criação
    list_display_links = ('id',)  # Torna o ID clicável para edição
    search_fields = ('id', 'bubble')  # Permite busca por ID e bolha associada
    ordering = ('-id',)  # Ordena os check-ins por ID em ordem decrescente
    list_per_page = 10  # Define limite de 10 itens por página
