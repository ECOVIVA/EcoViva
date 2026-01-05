from apps.users.application.ports.email_auth import EmailAuthenticator
from apps.users.domain.repositories.user import UserRepository
from apps.users.infrastructure.models.user import Users
from apps.users.infrastructure.repositories.user import UserRepositoryAssembler
from core.domain.exceptions import BusinessRuleError


class DjangoEmailAuthenticator:
    def __init__(self, repo: UserRepository) -> None:
        self._repo = repo

    def authenticate(self, *, email: str, password: str) -> Users:
        user = self.get_user(email)

        if not user.check_password(password):
            msg = "Senha Incorreta."
            raise BusinessRuleError(msg)

        if not user.is_active:
            msg = "Confirme seu email para acessar"
            raise BusinessRuleError(msg)

        return user

    def get_user(self, email: str) -> Users:
        return self._repo.get_model(email=email)


class EmailAuthenticatorAssembler:
    @staticmethod
    def create() -> EmailAuthenticator:
        repo = UserRepositoryAssembler.create()

        return DjangoEmailAuthenticator(repo)
