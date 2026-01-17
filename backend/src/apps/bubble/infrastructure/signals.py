from django.db import models
from django.dispatch import receiver

from apps.bubble.application.use_cases.difficulty.create_default import (
    CreateDefaultDifficultiesUseCase,
)
from apps.bubble.application.use_cases.rank.create_default import CreateDefaultRanksUseCase
from apps.bubble.infrastructure.mapper.difficulty import DifficultyDjangoMapper
from apps.bubble.infrastructure.mapper.rank import RankDjangoMapper
from apps.bubble.infrastructure.repositories.difficulty import DifficultyDjangoRepository
from apps.bubble.infrastructure.repositories.rank import RankDjangoRepository


@receiver(models.signals.post_migrate)
def signal_create_default_difficulties(sender: object, **kwargs: object) -> None:
    mapper = DifficultyDjangoMapper()
    repo = DifficultyDjangoRepository(mapper)

    CreateDefaultDifficultiesUseCase(repo).execute()


@receiver(models.signals.post_migrate)
def signal_create_default_ranks(sender: object, **kwargs: object) -> None:
    mapper = RankDjangoMapper()
    repo = RankDjangoRepository(mapper)

    CreateDefaultRanksUseCase(repo).execute()
