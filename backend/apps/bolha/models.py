from django.db import models
from django.utils import timezone
from ..usuarios.models import Users

""" 

Tabelas refrerente aos dados das Bolhas

    Os Campos que sarão usados em Bubble: 
    - id( Identificador de cada post )
    - user( id do Usuario dono da Bolha)
    - progress( Progresso da bolha)

    Os Campos que sarão usados em Check In: 
    - id( Identificador de cada post )
    - bubble( id da Bolha)
    - description( Descrição do check in)
    - data_time( Data e hora que o check in foi feito)

"""

class Bubble(models.Model):
    user = models.ForeignKey(Users, on_delete=models.CASCADE)
    progress = models.FloatField()

class CheckIn(models.Model):
    bubble = models.ForeignKey(Bubble, on_delete=models.CASCADE)
    description = models.CharField(max_length=256, blank=True)
    date_time = models.DateTimeField(default=timezone.now())