from apps.community.domain.entities.community import CommunityEntity
from apps.community.infrastructure.models.community import Community


class CommunityDjangoMapper:
    def to_entity(self, model: Community) -> CommunityEntity: ...

    def to_model(self, entity: CommunityEntity) -> Community: ...
