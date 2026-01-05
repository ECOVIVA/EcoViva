from rest_framework_simplejwt.tokens import RefreshToken

from apps.users.application.use_cases.authenticator import DjangoAuthenticator
from apps.users.application.use_cases.login_user import LoginUser
from apps.users.application.use_cases.logout_user import LogoutUser
from apps.users.application.use_cases.refresh_user import RefreshUser
from apps.users.infrastructure.repositories.user import UserRepositoryAssembler


class AuthFacade:
    def __init__(
        self, login_class: LoginUser, logout_class: LogoutUser, refresh_class: RefreshUser
    ) -> None:
        self.login_class = login_class
        self.logout_class = logout_class
        self.refresh_class = refresh_class

    def login(self, email: str, password: str) -> RefreshToken:
        return self.login_class.execute(email, password)

    def logout(self, refresh_token: str) -> None:
        return self.logout_class.execute(refresh_token)

    def refresh(self, refresh_token: str) -> str:
        return self.refresh_class.execute(refresh_token)


class AuthFacadeAssembler:
    @staticmethod
    def create() -> AuthFacade:
        repo = UserRepositoryAssembler.create()

        authenticator = DjangoAuthenticator(repo)

        login = LoginUser(authenticator)
        logout = LogoutUser()
        refresh = RefreshUser()

        return AuthFacade(login, logout, refresh)
