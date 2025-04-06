from django.contrib import admin  
from . import models  

"""
    Este módulo registra os modelos no painel de administração do Django,
    permitindo a gestão das lições, categorias, conquistas e regras de desbloqueio.

    - CategoryAdmin         → Administra as categorias de lições.
    - LessonAdmin           → Administra as lições disponíveis.
    - LessonCompletionAdmin → Administra as lições concluídas pelos usuários.
    - AchievementAdmin      → Administra as conquistas disponíveis.
    - AchievementRuleAdmin  → Administra as regras para desbloquear conquistas.
    - UserAchievementAdmin  → Administra as conquistas desbloqueadas pelos usuários.
"""

@admin.register(models.Category)  
class CategoryAdmin(admin.ModelAdmin):  
    """
    Configuração do painel administrativo para o modelo Category.
    Permite visualizar e gerenciar as categorias de lições.
    """
    list_display = ('id', 'name')  # Exibe o ID e o nome da categoria na lista  
    search_fields = ('name',)  # Permite busca pelo nome da categoria  
    ordering = ('name',)  # Ordena os registros pelo nome  


@admin.register(models.Lesson)  
class LessonAdmin(admin.ModelAdmin):  
    """
    Configuração do painel administrativo para o modelo Lesson.
    Permite visualizar e gerenciar as lições disponíveis.
    """
    list_display = ('id', 'title', 'created_at')  # Exibe ID, título e data de criação  
    search_fields = ('title',)  # Permite busca pelo título da lição  
    list_filter = ('categories',)  # Adiciona filtro por categoria  
    ordering = ('created_at',)  # Ordena os registros pela data de criação  
    filter_horizontal = ('categories',)  # Facilita a seleção de categorias no painel  


@admin.register(models.LessonCompletion)  
class LessonCompletionAdmin(admin.ModelAdmin):  
    """
    Configuração do painel administrativo para o modelo LessonCompletion.
    Permite visualizar e gerenciar as lições concluídas pelos usuários.
    """
    list_display = ('id', 'user', 'lesson', 'completed_at')  # Exibe ID, usuário, lição e data de conclusão  
    search_fields = ('user__username', 'lesson__title')  # Permite busca pelo nome do usuário e título da lição  
    list_filter = ('lesson',)  # Adiciona filtro por lição  
    ordering = ('-completed_at',)  # Ordena do mais recente para o mais antigo  


@admin.register(models.Achievement)  
class AchievementAdmin(admin.ModelAdmin):  
    """
    Configuração do painel administrativo para o modelo Achievement.
    Permite visualizar e gerenciar as conquistas disponíveis no sistema.
    """
    list_display = ("name", "description")  # Exibe nome e descrição da conquista  
    search_fields = ("name",)  # Permite busca pelo nome da conquista  


@admin.register(models.AchievementRule)  
class AchievementRuleAdmin(admin.ModelAdmin):  
    """
    Configuração do painel administrativo para o modelo AchievementRule.
    Permite visualizar e gerenciar as regras para desbloquear conquistas.
    """
    list_display = ("achievement", "category", "required_lessons")  # Exibe conquista, categoria e número de lições necessárias  
    list_filter = ("category",)  # Adiciona filtro por categoria  


@admin.register(models.UserAchievement)  
class UserAchievementAdmin(admin.ModelAdmin):  
    """
    Configuração do painel administrativo para o modelo UserAchievement.
    Permite visualizar e gerenciar as conquistas desbloqueadas pelos usuários.
    """
    list_display = ("user", "achievement", "unlocked_at")  # Exibe usuário, conquista e data de desbloqueio  
    list_filter = ("achievement", "unlocked_at")  # Adiciona filtros por conquista e data  
    search_fields = ("user__username", "achievement__name")  # Permite busca pelo nome do usuário e da conquista  
