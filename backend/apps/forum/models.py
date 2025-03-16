from django.db import models
from django.utils import timezone
from django.utils.text import slugify

from apps.users.models import Users

class Tags(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

class Thread(models.Model):
    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, blank=False)
    content = models.TextField()
    tags = models.ManyToManyField(Tags, blank=True,)
    author = models.ForeignKey(Users, on_delete=models.CASCADE)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        self.slug = slugify(self.title)

        unique_slug = self.slug
        counter = 1

        while self.__class__.objects.filter(slug=unique_slug).exists():
            unique_slug = f"{self.slug}-{counter}"
            counter += 1
        
        self.slug = unique_slug  # Atualiza o slug para garantir unicidade

        super().save(*args, **kwargs)

    def __str__(self):
        return self.title

class Post(models.Model):
    thread = models.ForeignKey(Thread, on_delete=models.CASCADE, related_name='posts')
    content = models.TextField()
    author = models.ForeignKey(Users, on_delete=models.CASCADE)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    parent_post = models.ForeignKey('self', null=True, blank=True, on_delete=models.CASCADE)

    def __str__(self):
        if self.parent_post:
            return f'Resposta de {self.author.username} para o post {self.parent_post.id} em "{self.thread.title}"'
        return f'Post de {self.author.username} em "{self.thread.title}"'
