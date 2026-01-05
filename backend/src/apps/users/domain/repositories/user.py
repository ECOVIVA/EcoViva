from abc import ABC, abstractmethod

from apps.users.domain.entities.user import UserEntity
from apps.users.infrastructure.models.user import Users


class UserRepository(ABC):
    @abstractmethod
    def create(self, entity: UserEntity) -> UserEntity:
        pass

    @abstractmethod
    def update(self, entity: UserEntity) -> UserEntity:
        pass

    @abstractmethod
    def get(self, **filters: object) -> UserEntity:
        pass

    @abstractmethod
    def get_model(self, **filters: object) -> Users:
        pass
