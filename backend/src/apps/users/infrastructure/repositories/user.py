from apps.users.domain.entities.user import UserEntity
from apps.users.infrastructure.mappers.user import UserRepositoryMapper
from apps.users.infrastructure.models.user import Users
from core.infrastructure.repositories.base import BaseRepository


class UserRepository(BaseRepository[UserEntity, Users]):
    def _to_entity(self, model: Users) -> UserEntity:
        return UserRepositoryMapper.to_entity(model)

    def _to_model(self, entity: UserEntity, instance: Users | None = None) -> Users:
        return UserRepositoryMapper.to_model(entity, instance)

    def create(self, entity: UserEntity) -> UserEntity:
        model = self._to_model(entity)
        model.save()
        return self._to_entity(model)

    def update(self, entity: UserEntity) -> UserEntity:
        model = self._get_model(pk=entity.id)
        model = self._to_model(entity, model)
        model.save()
        return self._to_entity(model)

    def get_by_pk(self, user_id: int) -> UserEntity:
        return self._get(id=user_id)
