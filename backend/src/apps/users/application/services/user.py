from apps.users.application.dtos.user import UserReadDTO, UserUpdateDTO, UserWriteDTO
from apps.users.application.use_cases.create_user import CreateUser
from apps.users.application.use_cases.get_user import GetUser
from apps.users.application.use_cases.update_user import UpdateUser
from apps.users.infrastructure.repositories.user import UserRepository


class UserFacade:
    def __init__(
        self, get_class: GetUser, create_class: CreateUser, update_class: UpdateUser
    ) -> None:
        self.get_class = get_class
        self.create_class = create_class
        self.update_class = update_class

    def get_user(self, user_id: int) -> UserReadDTO:
        return self.get_class.execute(user_id)

    def create_user(self, dto: UserWriteDTO) -> UserReadDTO:
        return self.create_class.execute(dto)

    def update_user(self, user_id: int, dto: UserUpdateDTO) -> UserReadDTO:
        return self.update_class.execute(user_id, dto)


class UserFacadeFactory:
    @staticmethod
    def create() -> UserFacade:
        repo = UserRepository()

        return UserFacade(GetUser(repo), CreateUser(repo), UpdateUser(repo))
