import os

from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import FileExtensionValidator
from django.dispatch import receiver
from django.contrib.auth.models import BaseUserManager
from django.db import models

from utils.image import validate_image_dimensions,validate_image_size



class UsersManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("O e-mail é obrigatório!")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)
    
""" 

Tabela refrerente aos dados de usuários, herdando do Model nativo do Django, Abstract User

    Os Campos que serão usados: 
    - id( Identificador de cada usuario )
    - username( Nome exclusivo de usuario)
    - first_name( Primeiro Nome do usuario)
    - last_name ( Sobrenome do usuario)
    - email ( Email do usuario)
    - phone ( Numero de telefone do usuario)
    - photos ( Imagens do perfil do usuario)

    Obs: Os campos groups e user_permissions foram definidos como None devido à obrigatoriedade imposta pela herança do AbstractUser, porém, não serão utilizados neste projeto.

"""

class Users(AbstractUser):

    # Classe Meta, responsável por definir como o model será chamado na area administrativa
    class Meta:
        app_label = 'users'
        verbose_name = "User"
        verbose_name_plural = "Users"

    email = models.EmailField(unique=True, blank = False, null=False)
    bio = models.TextField(max_length = 256, null = True, default = None)
    phone = models.CharField(max_length=15, blank=False, null=False)
    photo = models.ImageField(upload_to = "users_photos",  validators=[FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png']),validate_image_size, validate_image_dimensions,], null=True, blank=True)
    is_active = models.BooleanField(default=False)
    objects = UsersManager()

    groups = None
    user_permissions = None

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'phone']

    # Metodo responsável pela representação em string do Model
    def __str__(self):
        return f"User {self.username}"
    
@receiver(models.signals.post_delete, sender=Users)
def deletar_imagem_apos_excluir(sender, instance, **kwargs):
    if instance.photo:
        if os.path.isfile(instance.photo.path):
            os.remove(instance.photo.path)

@receiver(models.signals.pre_save, sender=Users)
def delete_old_image(sender, instance, **kwargs):
    """ Deleta a imagem antiga ao atualizar o campo de imagem. """
    if not instance.pk:  # Se for um novo objeto, não faz nada
        return

    try:
        old_instance = sender.objects.get(pk=instance.pk)  # Obtém a versão antiga do objeto
    except sender.DoesNotExist:
        return

    if old_instance.photo and old_instance.photo != instance.photo:  
        if os.path.isfile(old_instance.photo.path):  
            os.remove(old_instance.photo.path) 
