from django.db import models
from django.utils import timezone
from django.dispatch import receiver
from apps.bubble.models.bubble import Bubble, Rank, Difficulty

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

@receiver(models.signals.pre_save, sender=CheckIn)
def increment_points_for_bubble(sender, instance, **kwargs):
    bubble = instance.bubble  
    difficulty = bubble.rank.difficulty  

    if difficulty:  
        # Atualiza o progresso da bolha  
        bubble.progress += difficulty.points_for_activity  
        bubble.save()  

@receiver(models.signals.post_save, sender=CheckIn)
def upgrade_rank(sender, instance, **kwargs):
    bubble = instance.bubble  

    next_rank = Rank.objects.filter(points__lte=bubble.progress).order_by('-points').first()  
    if next_rank and next_rank != bubble.rank:  
        bubble.rank = next_rank  
        bubble.progress = 0  
        bubble.save()  