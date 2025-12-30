from apps.users.application.dtos.user import UserReadDTO
from apps.users.application.mappers.user import UserMapper
from apps.users.infrastructure.repositories.user import UserRepository


class GetUser:
    def __init__(self, repo: UserRepository) -> None:
        self.repository = repo

    def execute(self, pk: int) -> UserReadDTO:
        user = self.repository.get_by_pk(pk)
        return UserMapper.entity_to_dto(user)
