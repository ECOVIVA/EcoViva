from apps.community.domain.entities.challenge import ChallengeEntity
from apps.community.infrastructure.models.challenge import Challenge


class ChallengeDjangoMapper:
    def to_entity(self, model: Challenge) -> ChallengeEntity: ...

    def to_model(self, entity: ChallengeEntity) -> Challenge: ...
