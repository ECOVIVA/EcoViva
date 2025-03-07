from django.contrib import admin
from . import models

# Area responsavel por registrar e configurar o model Users, na minha area administrativa

# Registro do model Users
@admin.register(models.Users)
class UsersAdmin(admin.ModelAdmin):
    
    fieldsets = (
        (None, {"fields": ("username", "email", "password")}),
        ("Informações Pessoais", {"fields": ("first_name", "last_name")}),
        ("Status", {"fields": ("is_active", "is_staff", "is_superuser")}),
    )

    list_display = 'id', 'username', 'first_name','last_name', 'email', 'phone'
    list_display_links = 'id', 'username'
    search_fields = 'id','username', 'email', 'phone'
    ordering = '-id',

    list_per_page = 10