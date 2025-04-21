from django.contrib import admin
from . import models

"""
    Este módulo registra os modelos no painel de administração do Django,
    permitindo a gestão das lições, categorias, conquistas e registros dos usuários.

    - CategoryAdmin       → Administra as categorias de lições.
    - LessonAdmin         → Administra as lições disponíveis.
    - LessonLogAdmin      → Administra os registros de lições concluídas pelos usuários.
    - AchievementAdmin    → Administra as conquistas disponíveis.
    - AchievementLogAdmin → Administra as conquistas desbloqueadas pelos usuários.
"""

@admin.register(models.Category)
class CategoryAdmin(admin.ModelAdmin):
    """
    Configuração do painel administrativo para o modelo Category.
    Permite visualizar e gerenciar as categorias de lições.
    """
    list_display = ('id', 'name')  # Exibe ID e nome da categoria
    search_fields = ('name',)  # Permite busca pelo nome
    ordering = ('name',)  # Ordena em ordem alfabética


@admin.register(models.Lesson)
class LessonAdmin(admin.ModelAdmin):
    """
    Configuração do painel administrativo para o modelo Lesson.
    Permite visualizar e gerenciar as lições disponíveis.
    """
    list_display = ('id', 'title', 'created_at')  # Exibe ID, título e data de criação
    search_fields = ('title',)  # Permite busca pelo título
    list_filter = ('categories', 'created_at')  # Filtro por categorias e data
    ordering = ('-created_at',)  # Ordena da mais recente para a mais antiga
    filter_horizontal = ('categories',)  # Facilita seleção de categorias


@admin.register(models.LessonLog)
class LessonLogAdmin(admin.ModelAdmin):
    """
    Configuração do painel administrativo para o modelo LessonLog.
    Permite visualizar e gerenciar os registros de lições concluídas.
    """
    list_display = ('id', 'user', 'lesson', 'completed_at')  # Exibe ID, usuário, lição e data
    search_fields = ('user__username', 'lesson__title')  # Busca por usuário e lição
    list_filter = ('lesson', 'completed_at')  # Filtro por lição e data
    ordering = ('-completed_at',)


@admin.register(models.Achievement)
class AchievementAdmin(admin.ModelAdmin):
    """
    Configuração do painel administrativo para o modelo Achievement.
    Permite visualizar e gerenciar as conquistas do sistema.
    """
    list_display = ('id', 'name', 'category', 'condition')  # Exibe ID, nome, categoria e condição
    search_fields = ('name', 'category', 'condition')  # Busca por nome, categoria ou condição
    list_filter = ('category',)  # Filtro por categoria
    ordering = ('name',)


@admin.register(models.AchievementLog)
class AchievementLogAdmin(admin.ModelAdmin):
    """
    Configuração do painel administrativo para o modelo AchievementLog.
    Permite visualizar e gerenciar as conquistas desbloqueadas pelos usuários.
    """
    list_display = ('id', 'user', 'achievement', 'date_awarded')  # Exibe ID, usuário, conquista e data
