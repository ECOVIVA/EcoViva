from apps.users.domain.entities.user import NewUserEntity, UserEntity
from apps.users.infrastructure.models.user import Users
from core.infrastructure.repositories.base import BaseRepository, RepositoryWrite


class UserRepository(BaseRepository[UserEntity, Users], RepositoryWrite[UserEntity, NewUserEntity]):
    def _to_entity(self, model: Users) -> UserEntity:
        return UserEntity(
            id=model.pk,
            username=model.username,
            first_name=model.first_name,
            last_name=model.last_name,
            email=model.email,
            phone=model.phone,
            bio=model.bio,
            photo=model.photo.url,
            interests=list(model.interests.values_list("id", flat=True)),
            is_active=model.is_active,
        )

    def create(self, entity: NewUserEntity) -> UserEntity:
        model = self._create(
            username=entity.username,
            first_name=entity.first_name,
            last_name=entity.last_name,
            email=entity.email,
            phone=entity.phone,
            bio=entity.bio,
            photo=entity.photo,
            interests=entity.interests,
        )
        return self._to_entity(model)

    def get_by_pk(self, user_id: int) -> UserEntity:
        return self._get(id=user_id)
