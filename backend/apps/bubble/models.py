from django.db import models
from django.utils import timezone
from django.dispatch import receiver
from apps.users.models import Users

"""
    Este arquivo define os modelos de dados para as Bolhas e Check-Ins.

    Classes definidas:
    - Difficulty: Representa os diferentes níveis de dificuldade, cada um com um número de pontos por atividade.
    - Rank: Define os ranks associados às bolhas, dependendo da dificuldade e da pontuação.
    - Bubble: Representa uma bolha associada a um usuário, armazenando seu progresso e rank.
    - CheckIn: Registra um check-in dentro de uma bolha, incluindo descrição, data e pontos de experiência ganhos.
    
    Além disso, há um sinal post_migrate para criar automaticamente ranks padrão após a migração do banco de dados.
"""

class Difficulty(models.Model):
    # Representa o nível de dificuldade de uma atividade, atribuindo pontos correspondentes.
    name = models.CharField(max_length=100, unique=True) 
    points_for_activity = models.PositiveIntegerField()

    class Meta:
        verbose_name = 'Difficulty'
        verbose_name_plural = 'Difficulties'

    def __str__(self):
        return self.name

class Rank(models.Model):
    # Define um rank com base na dificuldade e na pontuação exigida.
    name = models.CharField(max_length=100, unique=True)
    difficulty = models.ForeignKey(Difficulty, on_delete=models.SET_DEFAULT, default=1)  
    points = models.PositiveIntegerField()

    class Meta:
        verbose_name = 'Rank'
        verbose_name_plural = 'Ranks'

    def __str__(self):
        return f"{self.name} ({self.difficulty.name})"

class Bubble(models.Model):
    # Representa uma "bolha" associada a um usuário, rastreando seu progresso e rank.
    class Meta:
        verbose_name = "Bubble"
        verbose_name_plural = "Bubbles"

    user = models.ForeignKey(Users, on_delete=models.CASCADE)
    progress = models.PositiveIntegerField(default=0)
    rank = models.ForeignKey(Rank, on_delete=models.SET_DEFAULT, default=1 )

    def __str__(self):
        return f"Bolha de {self.user}"

class CheckIn(models.Model):
    # Registra um check-in em uma bolha, contendo informações como descrição, data e pontos ganhos.
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
    """
    Após a migração do banco de dados, cria os ranks padrão caso ainda não existam.
    Define diferentes níveis de dificuldade e cria uma lista de ranks associados a elas.
    """
    if not Rank.objects.exists():  # Evita duplicação de ranks ao verificar se já existem
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
