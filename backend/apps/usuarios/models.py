from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import FileExtensionValidator

from utils.image import validate_image_dimensions,validate_image_size

from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models

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
        app_label = 'usuarios'
        verbose_name = "User"
        verbose_name_plural = "Users"

    email = models.EmailField(unique=True, blank = False, null=False)
    phone = models.CharField(max_length=15, blank=False, null=False)
    photo = models.ImageField(upload_to = "users_photos",  validators=[FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png']),validate_image_size, validate_image_dimensions,], null=True, blank=True)

    objects = UsersManager()

    groups = None
    user_permissions = None

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'phone']

    # Metodo responsável pela representação em string do Model
    def __str__(self):
        return f"User {self.username}"
    
    
