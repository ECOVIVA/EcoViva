from django.contrib import admin
from . import models

"""
    Configuração do Django Admin para gerenciamento do modelo Users.

    - UsersAdmin: Configuração personalizada para exibição e administração dos usuários no painel de administração.
    
    As configurações incluem organização dos campos, filtros, pesquisa e paginação.
"""

# Registro do modelo Users no Django Admin com configurações personalizadas
@admin.register(models.Users)
class UsersAdmin(admin.ModelAdmin):
    """
    Configuração da administração de usuários no Django Admin.
    
    - Define os campos exibidos na página de detalhes do usuário.
    - Personaliza a exibição da lista de usuários.
    - Adiciona busca, ordenação e paginação para melhor gerenciamento.
    """

    # Organização dos campos exibidos na página de detalhes do usuário
    fieldsets = (
        (None, {"fields": ("username", "email", "password")}),  # Campos essenciais de identificação e autenticação
        ("Informações Pessoais", {"fields": ("first_name", "last_name", "phone", "photo")}),  # Informações pessoais do usuário
        ("Status", {"fields": ("is_active", "is_staff", "is_superuser")}),  # Status e permissões do usuário
    )

    # Definição das colunas visíveis na lista de usuários no Django Admin
    list_display = ('id', 'username', 'first_name', 'last_name', 'email', 'phone')  # Exibe ID, nome, e-mail e telefone
    list_display_links = ('id', 'username')  # ID e nome de usuário são links para edição do usuário
    search_fields = ('id', 'username', 'email', 'phone')  # Permite busca pelos campos de ID, nome, e-mail e telefone
    ordering = ('-id',)  # Ordenação da lista de usuários pelo ID em ordem decrescente

    # Configuração de paginação para melhor visualização e desempenho
    list_per_page = 10  # Limita a exibição a 10 usuários por página na listagem


@admin.register(models.Interests)
class InterestsAdmin(admin.ModelAdmin):
    list_display = ('name',)  # Exibe o campo 'name' na lista
    search_fields = ('name',)  # Permite buscar pelo nome
    ordering = ('name',)  # Ordena alfabeticamente