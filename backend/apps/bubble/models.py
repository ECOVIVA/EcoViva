from django.db import models
from django.utils import timezone
from django.dispatch import receiver
from apps.users.models import Users

"""
    Modelos de dados para Bolhas e Check-Ins.

    - Difficulty: Representa os níveis de dificuldade, atribuindo pontos por atividade.
    - Rank: Define os ranks das bolhas, baseados na dificuldade e pontuação acumulada.
    - Bubble: Representa uma bolha associada a um usuário, armazenando progresso e rank.
    - CheckIn: Registra atividades realizadas dentro de uma bolha, atribuindo pontos de experiência.

    Também inclui um sinal `post_migrate` que cria automaticamente ranks padrão após a migração do banco de dados.
"""

class Difficulty(models.Model):
    """
    Define os níveis de dificuldade das atividades, determinando quantos pontos cada uma vale.
    """
    name = models.CharField(max_length=100, unique=True)  # Nome da dificuldade (ex.: Fácil, Médio, Difícil)
    points_for_activity = models.PositiveIntegerField()  # Pontos atribuídos por atividade nesta dificuldade

    class Meta:
        verbose_name = 'Difficulty'
        verbose_name_plural = 'Difficulties'

    def __str__(self):
        return self.name


class Rank(models.Model):
    """
    Representa um rank dentro de uma bolha, associado a um nível de dificuldade e uma pontuação mínima necessária.
    """
    name = models.CharField(max_length=100, unique=True)  # Nome do rank (ex.: Protetor do Planeta)
    difficulty = models.ForeignKey(Difficulty, on_delete=models.SET_DEFAULT, default=1)  # Nível de dificuldade do rank
    points = models.PositiveIntegerField()  # Pontuação necessária para alcançar este rank

    class Meta:
        verbose_name = 'Rank'
        verbose_name_plural = 'Ranks'

    def __str__(self):
        return f"{self.name} ({self.difficulty.name})"


class Bubble(models.Model):
    """
    Representa uma bolha associada a um usuário, registrando seu progresso e rank atual.
    """
    user = models.ForeignKey(Users, on_delete=models.CASCADE)  # Usuário proprietário da bolha
    progress = models.PositiveIntegerField(default=0)  # Pontuação acumulada dentro da bolha
    rank = models.ForeignKey(Rank, on_delete=models.SET_DEFAULT, default=1)  # Rank atual do usuário na bolha

    class Meta:
        verbose_name = "Bubble"
        verbose_name_plural = "Bubbles"

    def __str__(self):
        return f"Bolha de {self.user}"


class CheckIn(models.Model):
    """
    Registra um check-in dentro de uma bolha, incluindo descrição, data e pontos ganhos.
    """
    bubble = models.ForeignKey(Bubble, on_delete=models.CASCADE)  # Bolha onde o check-in foi realizado
    description = models.CharField(max_length=256, blank=True)  # Descrição opcional do check-in
    created_at = models.DateTimeField(default=timezone.now)  # Data e hora do check-in
    xp_earned = models.PositiveIntegerField(blank=True)  # Pontuação obtida no check-in

    class Meta:
        verbose_name = "Check-In"
        verbose_name_plural = "Check-Ins"

    def __str__(self):
        return f"Check-In {self.pk}"


# ----- Sinais para inicialização automática de dados -----

@receiver(models.signals.post_migrate)
def create_default_ranks(sender, **kwargs):
    """
    Cria automaticamente os ranks padrão após a migração do banco de dados.
    Evita duplicações verificando se os ranks já existem antes de criá-los.
    """
    if not Rank.objects.exists():  # Se não houver ranks, cria os padrões
        # Criando níveis de dificuldade caso ainda não existam
        easy = Difficulty.objects.get_or_create(name='Easy', points_for_activity=50)[0]
        medium = Difficulty.objects.get_or_create(name='Medium', points_for_activity=30)[0]
        hard = Difficulty.objects.get_or_create(name='Hard', points_for_activity=10)[0]

        # Lista de ranks a serem criados
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

        # Criando cada rank na base de dados se ainda não existir
        for rank_name, difficulty, points in ranks:
            Rank.objects.get_or_create(name=rank_name, difficulty=difficulty, points=points)
