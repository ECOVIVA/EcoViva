from django.db import models
from django.utils import timezone
from apps.usuarios.models import Users
from django.utils.text import slugify


""" 

Tabela refrerente aos dados de cada Post

    Os Campos que sarão usados: 
    - id( Identificador de cada post )
    - user( ID do usuario que fez o post)
    - content ( Conteudo do post )
    - date_time ( Dia e hora que o post foi feito )
    - parent_post ( Post pai, ou seja, post que foi respondido )

"""

"""
Modelo de Tags
- As Tags são palavras-chave ou categorias que podem ser associadas a múltiplos Posts.
- Cada tag tem um nome único.
"""

class Tags(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

"""
Modelo de Thread
- Cada Thread representa um tópico de discussão ou pergunta em um fórum.
- Cada thread possui um título, um conteúdo de introdução, tags associadas, um autor e timestamps para criação e atualização.
"""

class Thread(models.Model):
    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, blank=True)  # Slug para URL amigável
    content = models.TextField()
    tags = models.ManyToManyField(Tags, null=True,blank=True )
    author = models.ForeignKey(Users, on_delete=models.CASCADE)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.slug:  # Se não tiver slug, cria um baseado no título
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title

"""
Modelo de Post
- Cada Post é uma resposta ou comentário dentro de uma Thread.
- Um Post está sempre associado a uma Thread (a discussão à qual pertence).
- Cada post possui conteúdo, autor, e timestamps para criação e atualização.
"""

class Post(models.Model):
    thread = models.ForeignKey(Thread, on_delete=models.CASCADE, related_name='posts')
    content = models.TextField()
    author = models.ForeignKey(Users, on_delete=models.CASCADE)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    parent_post = models.ForeignKey('self', null=True, blank=True, on_delete=models.CASCADE)


    def __str__(self):
        if self.parent_post:
            return f'Resposta de {self.author.username} para o post {self.parent_post.id} em {self.thread.title}'
        return f'Post de {self.author.username} em {self.thread.title}'