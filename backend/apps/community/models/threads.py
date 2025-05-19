import os
from django.db import models
from django.utils import timezone
from django.utils.text import slugify
from django.dispatch import receiver
from django.core.validators import FileExtensionValidator
from utils.image import resize_image_preserve_aspect_ratio


from utils.image import validate_image_size
from apps.users.models import Users
from .community import Community

class Tags(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name  
    
class Thread(models.Model):
    community = models.ForeignKey(Community, on_delete=models.CASCADE)
    cover = models.ImageField(
        upload_to="threads_cover", 
        validators=[
            FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png']),  # Restringe formatos de imagem
            validate_image_size,  # Valida o tamanho da imagem
        ],
        null=True, 
        blank=True
    )
    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, blank=False)
    content = models.TextField()
    likes = models.ManyToManyField(Users, related_name='liked_threads', blank=True)
    tags = models.ManyToManyField(Tags, blank=True)  
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
        
        self.slug = unique_slug 

        super().save(*args, **kwargs)  

    def __str__(self):
        return self.title

class Post(models.Model):
    thread = models.ForeignKey(Thread, on_delete=models.CASCADE, related_name='posts')  
    content = models.TextField()
    author = models.ForeignKey(Users, on_delete=models.CASCADE) 
    created_at = models.DateTimeField(default=timezone.now) 
    updated_at = models.DateTimeField(auto_now=True)  

    def __str__(self):
        if self.parent_post:
            return f'Resposta de {self.author.username} para o post {self.parent_post.id} em "{self.thread.title}"'
        return f'Post de {self.author.username} em "{self.thread.title}"'
    
@receiver(models.signals.post_delete, sender=models.Thread)
def deletar_imagem_apos_excluir(sender, instance, **kwargs):
    if instance.cover: 
        if os.path.isfile(instance.cover.path):  
            os.remove(instance.cover.path)  


@receiver(models.signals.pre_save, sender=models.Thread)
def delete_old_image(sender, instance, **kwargs):
    if not instance.pk: 
        return

    try:
        old_instance = sender.objects.get(pk=instance.pk)  
    except sender.DoesNotExist:
        return  

    if old_instance.cover and old_instance.cover != instance.cover:
        if os.path.isfile(old_instance.cover.path): 
            os.remove(old_instance.cover.path)  

@receiver(models.signals.post_save, sender=models.Thread)
def resize_cover_image(sender, instance, **kwargs):
    if instance.cover:
        cover_path = instance.cover.path
        resize_image_preserve_aspect_ratio(cover_path, 800, 600)