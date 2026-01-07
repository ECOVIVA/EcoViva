from apps.community.application.dtos.competitor import CompetitorDTO
from apps.community.domain.entities.competitor import CompetitorEntity


class CompetitorMapper:
    def to_entity(self, dto: CompetitorDTO) -> CompetitorEntity: ...

    def to_dto(self, entity: CompetitorEntity) -> CompetitorDTO: ...
