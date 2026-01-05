from apps.users.application.dtos.user import UserReadDTO, UserUpdateDTO, UserWriteDTO
from apps.users.domain.entities.user import UserEntity
from apps.users.domain.values_objects.password import Password
from apps.users.domain.values_objects.user_profile.bio import Bio
from apps.users.domain.values_objects.user_profile.email import Email
from apps.users.domain.values_objects.user_profile.phone import Phone
from apps.users.domain.values_objects.user_profile.photo import Photo
from apps.users.domain.values_objects.user_profile.user_profile import UserProfile
from apps.users.domain.values_objects.user_profile.username import Username
from core.domain.exceptions import ValidationError


class UserMapper:
    @staticmethod
    def from_create_dto(dto: UserWriteDTO) -> UserEntity:
        profile = UserProfile(
            username=Username(dto.username),
            email=Email(dto.email),
            first_name=dto.first_name,
            last_name=dto.last_name,
            phone=Phone(dto.phone) if dto.phone else None,
            photo=Photo(dto.photo.name) if dto.photo else None,
            bio=Bio(dto.bio) if dto.bio else None,
        )
        return UserEntity(
            id=None,
            profile=profile,
            password=Password(dto.password),
        )

    @staticmethod
    def from_update_dto(dto: UserUpdateDTO, current: UserEntity) -> UserEntity:
        profile = UserProfile(
            username=current.profile.username,
            email=current.profile.email,
            first_name=dto.first_name,
            last_name=dto.last_name,
            phone=Phone(dto.phone) if dto.phone else None,
            photo=Photo(dto.photo.name) if dto.photo else None,
            bio=Bio(dto.bio) if dto.bio else None,
        )

        return UserEntity(
            id=current.id,
            profile=profile,
            password=None,
            is_active=current.is_active,
        )

    @staticmethod
    def entity_to_dto(entity: UserEntity) -> UserReadDTO:
        if not entity.id:
            msg = "Pegar um usuario sem ID, não é permitido."
            raise ValidationError(msg)

        return UserReadDTO(
            id=entity.id,
            username=entity.profile.username.value,
            email=entity.profile.email.value,
            first_name=entity.profile.first_name,
            last_name=entity.profile.last_name,
            phone=entity.profile.phone.value if entity.profile.phone else None,
            bio=entity.profile.bio.value if entity.profile.bio else None,
            photo=None,
            interests=None,
            is_active=entity.is_active,
        )
