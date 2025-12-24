from django.contrib import admin
from apps.study.models.lessons import Category, Lesson, LessonLog

"""
    Este módulo registra os modelos no painel de administração do Django,
    permitindo a gestão das lições, categorias, conquistas e registros dos usuários.

    - CategoryAdmin       → Administra as categorias de lições.
    - LessonAdmin         → Administra as lições disponíveis.
    - LessonLogAdmin      → Administra os registros de lições concluídas pelos usuários.
    - AchievementAdmin    → Administra as conquistas disponíveis.
    - AchievementLogAdmin → Administra as conquistas desbloqueadas pelos usuários.
"""

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    """
    Configuração do painel administrativo para o modelo Category.
    Permite visualizar e gerenciar as categorias de lições.
    """
    list_display = ('id', 'name')  # Exibe ID e nome da categoria
    search_fields = ('name',)  # Permite busca pelo nome
    ordering = ('name',)  # Ordena em ordem alfabética


@admin.register(Lesson)
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


@admin.register(LessonLog)
class LessonLogAdmin(admin.ModelAdmin):
    """
    Configuração do painel administrativo para o modelo LessonLog.
    Permite visualizar e gerenciar os registros de lições concluídas.
    """
    list_display = ('id', 'user', 'lesson', 'completed_at')  # Exibe ID, usuário, lição e data
    search_fields = ('user__username', 'lesson__title')  # Busca por usuário e lição
    list_filter = ('lesson', 'completed_at')  # Filtro por lição e data
    ordering = ('-completed_at',)
