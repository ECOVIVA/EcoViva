from apps.users.application.dtos.user import UserReadDTO, UserUpdateDTO
from apps.users.application.mappers.user import UserMapper
from apps.users.domain.repositories.user import UserRepository


class UpdateUser:
    def __init__(self, repo: UserRepository) -> None:
        self.repository = repo

    def execute(self, user_id: int, dto: UserUpdateDTO) -> UserReadDTO:
        user = self.repository.get(pk=user_id)
        data = UserMapper.from_update_dto(dto, user)

        updated_user = self.repository.update(data)
        return UserMapper.entity_to_dto(updated_user)
