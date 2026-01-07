from apps.community.application.dtos.challenge import ChallengeDTO
from apps.community.domain.entities.challenge import ChallengeEntity


class ChallengeMapper:
    def to_entity(self, dto: ChallengeDTO) -> ChallengeEntity: ...

    def to_dto(self, entity: ChallengeEntity) -> ChallengeDTO: ...
