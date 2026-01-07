from apps.community.application.dtos.community import CommunityDTO
from apps.community.application.mappers.community import CommunityMapper
from apps.community.application.use_cases.community.add_member import RequestJoinCommunity
from apps.community.application.use_cases.community.delete_community import DeleteCommunity
from apps.community.application.use_cases.community.get_community import GetCommunity
from apps.community.application.use_cases.community.list_community import ListCommunity
from apps.community.infrastructure.mappers.community import CommunityDjangoMapper
from apps.community.infrastructure.repositories.community import DjangoCommunityRepository


class CommunityServiceFacade:
    def __init__(
        self,
        get_class: GetCommunity,
        list_class: ListCommunity,
        request_class: RequestJoinCommunity,
        delete_class: DeleteCommunity,
    ) -> None:
        self.get_class = get_class
        self.list_class = list_class
        self.request_class = request_class
        self.delete_class = delete_class

    def get_community(self, **filters: object) -> CommunityDTO:
        return self.get_class.execute(**filters)

    def list_communities(self, **filters: object) -> list[CommunityDTO]:
        return self.list_class.execute(**filters)

    def request_join(self, community_slug: str, user_id: int) -> None:
        return self.request_class.execute(community_slug, user_id)

    def delete_community(self, community_id: int) -> None:
        delete_use_case = DeleteCommunity(repo=self.get_class.repo)
        return delete_use_case.execute(community_id)


class CommunityServiceAssembler:
    @staticmethod
    def create() -> CommunityServiceFacade:
        repo_mapper = CommunityDjangoMapper()
        repo = DjangoCommunityRepository(repo_mapper)

        mapper = CommunityMapper()

        get_class = GetCommunity(repo=repo, mapper=mapper)
        list_class = ListCommunity(repo=repo, mapper=mapper)
        request_class = RequestJoinCommunity(repo=repo)
        delete_class = DeleteCommunity(repo=repo)

        return CommunityServiceFacade(
            get_class=get_class,
            list_class=list_class,
            request_class=request_class,
            delete_class=delete_class,
        )
