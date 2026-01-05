from apps.users.domain.entities.user import UserEntity
from apps.users.domain.repositories.user import UserRepository
from apps.users.infrastructure.mappers.user import UserRepositoryMapper
from apps.users.infrastructure.models.user import Users
from core.infrastructure.repositories.base import ORMRepository
from core.infrastructure.repositories.django_repository import DjangoORMRepository


class UserDjangoRepository(UserRepository):
    def __init__(self, orm: ORMRepository[Users], mapper: UserRepositoryMapper) -> None:
        self.orm = orm
        self.mapper = mapper

    def to_entity(self, model: Users) -> UserEntity:
        return self.mapper.to_entity(model)

    def to_model(self, entity: UserEntity, instance: Users | None = None) -> Users:
        return self.mapper.to_model(entity, instance)

    def get_model(self, **filters: object) -> Users:
        return self.orm.get(**filters)

    def get(self, **filters: object) -> UserEntity:
        model = self.orm.get(**filters)
        return self.to_entity(model)

    def create(self, entity: UserEntity) -> UserEntity:
        model = self.to_model(entity)
        self.orm.save(model)
        return self.to_entity(model)

    def update(self, entity: UserEntity) -> UserEntity:
        model = self.orm.get(pk=entity.id)
        model = self.to_model(entity, model)
        self.orm.save(model)
        return self.to_entity(model)


class UserRepositoryAssembler:
    @staticmethod
    def create() -> UserRepository:
        mapper = UserRepositoryMapper()
        orm = DjangoORMRepository(Users)

        return UserDjangoRepository(orm, mapper)
