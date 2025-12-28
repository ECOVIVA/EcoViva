from apps.users.domain.entities.user import UserEntity
from apps.users.infrastructure.repositories.user import UserRepository


class UserService:
    def to_dto(self, entity: UserEntity) -> object: ...

    def to_entity(self, dto_input: object) -> UserEntity: ...

    def get_user(self, user_id: int) -> UserEntity:
        return UserRepository().get_by_pk(user_id)

    def create_user(self, user_id: object) -> object: ...
