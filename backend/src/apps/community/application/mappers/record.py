from apps.community.application.dtos.record import RecordDTO
from apps.community.domain.entities.record import RecordEntity


class RecordMapper:
    def to_entity(self, dto: RecordDTO) -> RecordEntity: ...

    def to_dto(self, entity: RecordEntity) -> RecordDTO: ...
