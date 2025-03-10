from django.db import models
from django.utils import timezone
from apps.usuarios.models import Users

""" 

Tabelas refrerente aos dados das Bolhas

    Os Campos que sarão usados em Bubble: 
    - id( Identificador de cada post )
    - user( id do Usuario dono da Bolha)
    - progress( Progresso da bolha)
    - rank (Define o rank daquela bolha)

    Os Campos que sarão usados em Check In: 
    - id( Identificador de cada post )
    - bubble( id da Bolha)
    - description( Descrição do check in)
    - data_time( Data e hora que o check in foi feito)

"""

class Bubble(models.Model):
    RANKS_CHOICES = [
        ('INICIANTE_VERDE', 'Iniciante Verde'),
        ('GUARDIAO_DO_ECO', 'Guardião do Eco'),
        ('DEFENSOR_DA_NATUREZA', 'Defensor da Natureza'),
        ('HEROI_SUSTENTAVEL', 'Herói Sustentável'),
        ('LIDER_VERDE', 'Líder Verde'),
    ]
    
    # Classe responsável por definir como o model será chamado na area administrativa
    class Meta:
        verbose_name = "Bubble"
        verbose_name_plural = "Bubbles"

    user = models.ForeignKey(Users, on_delete=models.CASCADE)
    progress = models.FloatField(default = 0)
    rank = models.CharField(
        max_length=50,
        choices= RANKS_CHOICES,
        default="INICIANTE_VERDE"
    )

    # Metodo responsável pela representação em string do Model
    def __str__(self):
        return f"Bolha de {self.user}"

class CheckIn(models.Model):

    # Classe responsável por definir como o model será chamado na area administrativa
    class Meta:
        verbose_name = "Check-In"
        verbose_name_plural = "Check-Ins"

    bubble = models.ForeignKey(Bubble, on_delete=models.CASCADE)
    description = models.CharField(max_length=256, blank=True)
    date_time = models.DateTimeField(default=timezone.now)

    # Metodo responsável pela representação em string do Model
    def __str__(self):
        return f"Check-In {self.pk}"