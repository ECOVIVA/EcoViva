from apps.community.application.dtos.community import CommunityDTO
from apps.community.domain.entities.community import CommunityEntity


class CommunityMapper:
    def to_entity(self, dto: CommunityDTO) -> CommunityEntity: ...

    def to_dto(self, entity: CommunityEntity) -> CommunityDTO: ...
