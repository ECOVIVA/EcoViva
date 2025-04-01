from django.contrib import admin
from . import models

# Área responsável por registrar e configurar o modelo Users na área administrativa do Django

# Registro do modelo Users no Django Admin com configurações personalizadas
@admin.register(models.Users)
class UsersAdmin(admin.ModelAdmin):
    
    # Definindo os conjuntos de campos para exibição na página de detalhes do usuário
    fieldsets = (
        (None, {"fields": ("username", "email", "password")}),  # Campos essenciais de identificação e autenticação
        ("Informações Pessoais", {"fields": ("first_name", "last_name", "phone", "photo")}),  # Informações pessoais do usuário
        ("Status", {"fields": ("is_active", "is_staff", "is_superuser")}),  # Status e permissões do usuário
    )

    # Definindo as colunas que serão exibidas na lista de usuários no admin
    list_display = 'id', 'username', 'first_name', 'last_name', 'email', 'phone'  # Exibe ID, nome, e-mail e telefone
    list_display_links = 'id', 'username'  # Tornando o ID e o nome de usuário clicáveis para editar o usuário
    search_fields = 'id', 'username', 'email', 'phone'  # Campos onde o administrador pode realizar buscas
    ordering = '-id',  # Ordenando a lista de usuários pela coluna 'id' em ordem decrescente

    # Definindo o número de usuários exibidos por página na lista
    list_per_page = 10  # Limita a 10 usuários por página na listagem
