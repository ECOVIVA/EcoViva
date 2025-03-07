from django.contrib import admin
from . import models

# Area responsavel por registrar e configurar os models Bubble e CheckIn, na minha area administrativa

# Registro do model Bubble
@admin.register(models.Bubble)
class BubbleAdmin(admin.ModelAdmin):
    list_display = 'id', 'user', 'progress'
    list_display_links = 'id',
    search_fields = 'id', 'user'
    ordering = '-id',
    
    list_per_page = 10

# Registro do model CheckIn
@admin.register(models.CheckIn)
class CheckInAdmin(admin.ModelAdmin):
    list_display = 'id', 'bubble', 'date_time'
    list_display_links = 'id',
    search_fields = 'id', 'bubble'
    ordering = '-id',
    
    list_per_page = 10