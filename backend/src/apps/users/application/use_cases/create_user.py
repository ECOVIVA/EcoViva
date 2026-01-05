from apps.users.application.dtos.user import UserReadDTO, UserWriteDTO
from apps.users.application.mappers.user import UserMapper
from apps.users.domain.repositories.user import UserRepository


class CreateUser:
    def __init__(self, repo: UserRepository) -> None:
        self.repository = repo

    def execute(self, dto: UserWriteDTO) -> UserReadDTO:
        user = UserMapper.from_create_dto(dto)
        created_user = self.repository.create(user)

        return UserMapper.entity_to_dto(created_user)
