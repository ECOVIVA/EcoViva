from apps.users.domain.entities.user import UserEntity
from apps.users.domain.values_objects.bio import Bio
from apps.users.domain.values_objects.email import Email
from apps.users.domain.values_objects.phone import Phone
from apps.users.domain.values_objects.photo import Photo
from apps.users.domain.values_objects.username import Username
from apps.users.infrastructure.models.user import Users


class UserRepositoryMapper:
    @staticmethod
    def to_entity(model: Users) -> UserEntity:
        return UserEntity(
            id=model.pk,
            username=Username(model.username),
            first_name=model.first_name,
            last_name=model.last_name,
            email=Email(model.email),
            phone=Phone(model.phone),
            bio=Bio(model.bio) if model.bio else None,
            photo=Photo(model.photo.url),
            is_active=model.is_active,
            password=None,
        )

    @staticmethod
    def to_model(entity: UserEntity, instance: Users | None = None) -> Users:
        model = instance or Users()

        model.username = entity.username.value
        model.first_name = entity.first_name
        model.last_name = entity.last_name
        model.email = entity.email.value

        if entity.phone is not None:
            model.phone = entity.phone.value

        if entity.bio is not None:
            model.bio = entity.bio.value

        model.is_active = entity.is_active

        if entity.photo is not None:
            model.photo = entity.photo  # type: ignore

        return model
