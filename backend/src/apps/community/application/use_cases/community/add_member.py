from apps.community.application.ports.repositories.community import CommunityRepository


class RequestJoinCommunity:
    def __init__(self, repo: CommunityRepository) -> None:
        self.repo = repo

    def execute(self, community_slug: str, user_id: int) -> None:
        community = self.repo.get(slug=community_slug)
        community.request_membership(user_id)
        self.repo.save(community)
