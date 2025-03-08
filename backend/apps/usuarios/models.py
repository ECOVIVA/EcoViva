from django.db import models
from django.contrib.auth.models import AbstractUser

""" 

Tabela refrerente aos dados de usuários, herdando do Model nativo do Django, Abstract User

    Os Campos que sarão usados: 
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
        verbose_name = "User"
        verbose_name_plural = "Users"

    phone = models.CharField(max_length=15, blank=True, null=True)
    photo = models.ImageField(upload_to = "users_photos", null=True, blank=True)

    groups = None
    user_permissions = None

    # Metodo responsável pela representação em string do Model
    def __str__(self):
        return f"User {self.username}"
