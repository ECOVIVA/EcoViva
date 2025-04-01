from django.db import models
from django.utils import timezone
from django.dispatch import receiver
from apps.users.models import Users

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

class Difficulty(models.Model):
    name = models.CharField(max_length=100, unique=True) 
    points_for_activity = models.PositiveIntegerField()

    class Meta:
        verbose_name = 'Difficulty'
        verbose_name_plural = 'Difficulties'

    def __str__(self):
        return self.name

class Rank(models.Model):
    name = models.CharField(max_length=100, unique=True)
    difficulty = models.ForeignKey(Difficulty, on_delete= models.SET_DEFAULT, default=1)  
    points = models.PositiveIntegerField()

    class Meta:
        verbose_name = 'Rank'
        verbose_name_plural = 'Ranks'

    def __str__(self):
        return f"{self.name} ({self.difficulty.name})"
    


class Bubble(models.Model):
    class Meta:
        verbose_name = "Bubble"
        verbose_name_plural = "Bubbles"

    user = models.ForeignKey(Users, on_delete=models.CASCADE)
    progress = models.PositiveIntegerField(default = 0)
    rank = models.ForeignKey(Rank, on_delete=models.SET_DEFAULT, default=1 )

    # Metodo responsável pela representação em string do Model
    def __str__(self):
        return f"Bolha de {self.user}"

class CheckIn(models.Model):

    # Classe responsável por definir como o model será chamado na área administrativa
    class Meta:
        verbose_name = "Check-In"
        verbose_name_plural = "Check-Ins"

    bubble = models.ForeignKey(Bubble, on_delete=models.CASCADE)
    description = models.CharField(max_length=256, blank=True)
    created_at = models.DateTimeField(default=timezone.now)
    xp_earned = models.PositiveIntegerField(blank=True)
    
    def __str__(self):
        return f"Check-In {self.pk}"
    
    
@receiver(models.signals.post_migrate)
def create_default_ranks(sender, **kwargs):
    # Verifique se os ranks já existem para evitar a duplicação
    if not Rank.objects.exists():  # Se não houver nenhum rank, cria os ranks iniciais
        easy = Difficulty.objects.get_or_create(name='Easy', points_for_activity=50)[0]
        medium = Difficulty.objects.get_or_create(name='Medium', points_for_activity=30)[0]
        hard = Difficulty.objects.get_or_create(name='Hard', points_for_activity=10)[0]

        ranks = [
            ('Iniciante Verde', easy, 100),
            ('Guardião do Eco', easy, 150),
            ('Protetor do Planeta', easy, 200),
            ('Defensor da Natureza', medium, 300),
            ('Herói Sustentável', medium, 400),
            ('Sustentável Líder', medium, 500),
            ('Líder Verde', hard, 700),
            ('Guardião da Floresta', hard, 800),
            ('Protetor Global', hard, 1000),
        ]

        for rank_name, difficulty, points in ranks:
            Rank.objects.get_or_create(name=rank_name, difficulty=difficulty, points=points)