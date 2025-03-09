from django.db import models
from django.utils import timezone
from apps.usuarios.models import Users

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

    # Classe responsável por definir como o model será chamado na area administrativa
    class Meta:
        verbose_name = "Post"
        verbose_name_plural = "Posts"

    user = models.ForeignKey(Users, on_delete=models.CASCADE)
    content = models.CharField(max_length = 500)
    date_time = models.DateTimeField(default=timezone.now)
    parent_post = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True)

    # Metodo responsável pela representação em string do Model
    def __str__(self):
        return f"Post {self.pk}"