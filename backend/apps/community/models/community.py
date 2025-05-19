import os
from django.db import models
from django.utils.text import slugify
from django.dispatch import receiver
from django.core.validators import FileExtensionValidator
from utils.image import resize_image_preserve_aspect_ratio

from utils.image import validate_image_size
from apps.users.models import Users

class Community(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(unique=True, blank=True, null=False)
    description = models.TextField()
    banner = models.ImageField(upload_to='community_banners/', blank=True, null=True)
    icon = models.ImageField(upload_to='community_icons/', blank=True, null=True, validators=[
            FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png']),
            validate_image_size,
        ],)
    owner = models.ForeignKey(Users, on_delete=models.CASCADE, related_name="communities_owned")
    admins = models.ManyToManyField(Users, blank=True, related_name="communities_admin")
    pending_requests = models.ManyToManyField(Users, blank=True, related_name="communities_pending")
    members = models.ManyToManyField(Users, blank=True, related_name="communities_member")
    created_at = models.DateTimeField(auto_now_add=True)
    is_private = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name
    

@receiver(models.signals.post_save, sender=models.Community)
def owner_is_admin(sender, instance, **kwargs):
    if instance.owner and instance.owner not in instance.admins.all():
        instance.admins.add(instance.owner)
        instance.members.add(instance.owner)

@receiver(models.signals.post_delete, sender=models.Community)
def deletar_imagens_apos_excluir(sender, instance, **kwargs):
    """Remove as imagens do servidor quando a comunidade for excluída."""
    for image_field in [instance.banner, instance.icon]:
        if image_field and hasattr(image_field, 'path') and os.path.isfile(image_field.path):
            os.remove(image_field.path)

@receiver(models.signals.pre_save, sender=models.Community)
def deletar_imagens_antigas_ao_salvar(sender, instance, **kwargs):
    """Remove imagens antigas quando os campos forem atualizados."""
    if not instance.pk:
        return

    try:
        old_instance = sender.objects.get(pk=instance.pk)
    except sender.DoesNotExist:
        return

    for field_name in ['banner', 'icon']:
        old_file = getattr(old_instance, field_name)
        new_file = getattr(instance, field_name)

        if old_file and old_file != new_file and hasattr(old_file, 'path') and os.path.isfile(old_file.path):
            os.remove(old_file.path)

@receiver(models.signals.post_save, sender=models.Community)
def resize_community_images(sender, instance, **kwargs):
    # Verifica se a imagem do banner precisa ser redimensionada
    if instance.banner:
        banner_path = instance.banner.path
        resize_image_preserve_aspect_ratio(banner_path, 800, 600)

    # Verifica se a imagem do ícone precisa ser redimensionada
    if instance.icon:
        icon_path = instance.icon.path
        resize_image_preserve_aspect_ratio(icon_path, 250, 250)