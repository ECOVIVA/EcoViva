import os
from django.db import models
from django.utils import timezone
from django.utils.text import slugify
from django.core.validators import FileExtensionValidator
from django.dispatch import receiver

from utils.image import validate_image_dimensions,validate_image_size

from apps.users.models import Users

class Tags(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

class Thread(models.Model):
    cover = models.ImageField(upload_to = "threads_cover",  validators=[FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png']),validate_image_size, validate_image_dimensions,], null=True, blank=True)
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
    
@receiver(models.signals.post_delete, sender=Thread)
def deletar_imagem_apos_excluir(sender, instance, **kwargs):
    if instance.cover:
        if os.path.isfile(instance.cover.path):
            os.remove(instance.cover.path)

@receiver(models.signals.pre_save, sender=Thread)
def delete_old_image(sender, instance, **kwargs):
    """ Deleta a imagem antiga ao atualizar o campo de imagem. """
    if not instance.pk:  # Se for um novo objeto, não faz nada
        return

    try:
        old_instance = sender.objects.get(pk=instance.pk)  # Obtém a versão antiga do objeto
    except sender.DoesNotExist:
        return

    if old_instance.cover and old_instance.cover != instance.cover:  
        if os.path.isfile(old_instance.cover.path):  
            os.remove(old_instance.cover.path) 


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
