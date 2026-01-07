from apps.community.infrastructure.mappers.challenge import ChallengeDjangoMapper


class ChallengeRepository:
    def __init__(self, mapper: ChallengeDjangoMapper) -> None:
        self.mapper = mapper
