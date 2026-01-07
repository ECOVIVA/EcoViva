from apps.community.infrastructure.mappers.competitor import CompetitorDjangoMapper


class CompetitorRepository:
    def __init__(self, mappper: CompetitorDjangoMapper) -> None:
        self.mapper = mappper
