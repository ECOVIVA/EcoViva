from apps.community.domain.entities.competitor import CompetitorEntity
from apps.community.infrastructure.models.competitor import ChallengeCompetitor


class CompetitorDjangoMapper:
    def to_entity(self, model: ChallengeCompetitor) -> CompetitorEntity: ...

    def to_model(self, entity: CompetitorEntity) -> ChallengeCompetitor: ...
