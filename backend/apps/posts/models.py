from django.db import models
from django.utils import timezone
from ..usuarios.models import Users

""" 

Tabela refrerente aos dados de cada Post

    Os Campos que sarão usados: 
    - id( Identificador de cada post )
    - user( ID do usuario que fez o post)
    - content ( Conteudo do post )
    - date_time ( Dia e hora que o post foi feito )
    - parent_post ( Post pai, ou seja, post que foi respondido )

"""

class Post(models.Model):
    user = models.ForeignKey(Users, on_delete=models.CASCADE)
    content = models.CharField(max_length = 500)
    date_time = models.DateTimeField(default=timezone.now())
    parent_post = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True)