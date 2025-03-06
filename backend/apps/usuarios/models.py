from django.db import models
from django.contrib.auth.models import AbstractUser

""" 

Tabela refrerente aos dados de usuários, herdando do Model nativo do Django, Abstract User

    Os Campos que sarão usados: 
    - id( Identificador de cada usuario )
    - first_name( Nome do usuario)
    - last_name ( Sobrenome do usuario)
    - email ( Email do usuario)
    - phone ( Numero de telefone do usuario)

"""

class Users(AbstractUser):
    phone = models.CharField(max_length=15, blank=True, null=True)
