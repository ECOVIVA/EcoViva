from django.contrib import admin
from . import models

# Area responsavel por registrar e configurar o model Post, na minha area administrativa

# Registro do model Post
@admin.register(models.Post)
class PostAdmin(admin.ModelAdmin):
    list_display = 'id', 'content', 'date_time', 'parent_post'
    list_display_links = 'id',
    search_fields = 'id', 'content'
    ordering = '-id',
    
    list_per_page = 10
