from apps.community.domain.entities.record import RecordEntity
from apps.community.infrastructure.models.record import ChallengeRecord


class RecordDjangoMapper:
    def to_entity(self, model: ChallengeRecord) -> RecordEntity: ...

    def to_model(self, model: RecordEntity) -> ChallengeRecord: ...
