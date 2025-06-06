from django.contrib import admin
from apps.study.models.achievement import Achievement, AchievementLog

@admin.register(Achievement)
class AchievementAdmin(admin.ModelAdmin):
    """
    Configuração do painel administrativo para o modelo Achievement.
    Permite visualizar e gerenciar as conquistas do sistema.
    """
    list_display = ('id', 'name', 'category', 'condition')  # Exibe ID, nome, categoria e condição
    search_fields = ('name', 'category', 'condition')  # Busca por nome, categoria ou condição
    list_filter = ('category',)  # Filtro por categoria
    ordering = ('name',)


@admin.register(AchievementLog)
class AchievementLogAdmin(admin.ModelAdmin):
    """
    Configuração do painel administrativo para o modelo AchievementLog.
    Permite visualizar e gerenciar as conquistas desbloqueadas pelos usuários.
    """
    list_display = ('id', 'user', 'achievement', 'date_awarded')  # Exibe ID, usuário, conquista e data
