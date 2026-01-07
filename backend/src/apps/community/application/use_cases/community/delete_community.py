from apps.community.application.ports.repositories.community import CommunityRepository


class DeleteCommunity:
    def __init__(self, repo: CommunityRepository) -> None:
        self.repo = repo

    def execute(self, community_id: int) -> None:
        self.repo.delete(community_id)
