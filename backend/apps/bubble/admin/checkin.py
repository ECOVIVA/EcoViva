from django.contrib import admin
from apps.bubble.models.checkin import CheckIn

@admin.register(CheckIn)
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
