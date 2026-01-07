from apps.community.domain.entities.community import CommunityEntity
from apps.community.infrastructure.mappers.community import CommunityDjangoMapper
from apps.community.infrastructure.models.community import Community


class DjangoCommunityRepository:
    def __init__(self, mappper: CommunityDjangoMapper) -> None:
        self.mapper = mappper

    def list(self, **filters: object) -> list[CommunityEntity]:
        communities = Community.objects.filter(**filters)
        return [self.mapper.to_entity(community) for community in communities]

    def get(self, **filters: object) -> CommunityEntity:
        community = Community.objects.get(**filters)
        return self.mapper.to_entity(community)

    def delete(self, community_id: int) -> None:
        Community.objects.filter(id=community_id).delete()

    def save(self, entity: CommunityEntity) -> CommunityEntity:
        model = self.mapper.to_model(entity)
        model.save()
        return self.mapper.to_entity(model)
