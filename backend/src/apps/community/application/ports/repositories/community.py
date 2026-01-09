from typing import Protocol, TypedDict

from apps.community.domain.entities.community import CommunityEntity


class CommunityFilter(TypedDict, total=False):
    id: int
    slug: str
    owner_id: int
    is_private: bool


class CommunityRepository(Protocol):
    def list(self, filters: CommunityFilter | None) -> list[CommunityEntity]: ...

    def get(self, filters: CommunityFilter | None) -> CommunityEntity: ...

    def save(self, entity: CommunityEntity) -> CommunityEntity: ...

    def delete(self, community_id: int) -> None: ...
