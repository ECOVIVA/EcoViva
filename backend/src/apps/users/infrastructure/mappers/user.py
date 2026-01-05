from apps.users.domain.entities.user import UserEntity
from apps.users.domain.values_objects.user_profile.bio import Bio
from apps.users.domain.values_objects.user_profile.email import Email
from apps.users.domain.values_objects.user_profile.phone import Phone
from apps.users.domain.values_objects.user_profile.photo import Photo
from apps.users.domain.values_objects.user_profile.user_profile import UserProfile
from apps.users.domain.values_objects.user_profile.username import Username
from apps.users.infrastructure.models.user import Users


class UserRepositoryMapper:
    @staticmethod
    def to_entity(model: Users) -> UserEntity:
        profile = UserProfile(
            username=Username(model.username),
            first_name=model.first_name,
            last_name=model.last_name,
            email=Email(model.email),
            phone=Phone(model.phone),
            bio=Bio(model.bio) if model.bio else None,
            photo=Photo(model.photo.url),
        )

        return UserEntity(
            id=model.pk,
            profile=profile,
            is_active=model.is_active,
            password=None,
        )

    @staticmethod
    def to_model(entity: UserEntity, instance: Users | None = None) -> Users:
        model = instance or Users()

        model.username = entity.profile.username.value
        model.first_name = entity.profile.first_name
        model.last_name = entity.profile.last_name
        model.email = entity.profile.email.value

        if entity.profile.phone is not None:
            model.phone = entity.profile.phone.value

        if entity.profile.bio is not None:
            model.bio = entity.profile.bio.value

        model.is_active = entity.is_active

        if entity.profile.photo is not None:
            model.photo = entity.profile.photo.value  # type: ignore[assignment]

        return model
