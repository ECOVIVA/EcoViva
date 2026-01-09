from apps.community.application.dtos.community import CommunityDTO
from apps.community.application.mappers.community import CommunityMapper
from apps.community.application.ports.repositories.community import (
    CommunityFilter,
    CommunityRepository,
)


class ListCommunity:
    def __init__(self, repo: CommunityRepository, mapper: CommunityMapper) -> None:
        self.repo = repo
        self.mapper = mapper

    def execute(self, filters: CommunityFilter | None) -> list[CommunityDTO]:
        communities = self.repo.list(filters)
        return [self.mapper.to_dto(community) for community in communities]
