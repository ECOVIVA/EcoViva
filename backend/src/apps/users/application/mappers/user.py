from apps.users.application.dtos.user import UserReadDTO, UserUpdateDTO, UserWriteDTO
from apps.users.domain.entities.user import UserEntity
from apps.users.domain.values_objects.bio import Bio
from apps.users.domain.values_objects.email import Email
from apps.users.domain.values_objects.password import Password
from apps.users.domain.values_objects.phone import Phone
from apps.users.domain.values_objects.photo import Photo
from apps.users.domain.values_objects.username import Username
from core.domain.exceptions import ValidationError


class UserMapper:
    @staticmethod
    def from_create_dto(dto: UserWriteDTO) -> UserEntity:
        return UserEntity(
            id=None,
            username=Username(dto.username),
            email=Email(dto.email),
            password=Password(dto.password),
            first_name=dto.first_name,
            last_name=dto.last_name,
            phone=Phone(dto.phone) if dto.phone else None,
            photo=Photo(dto.photo.name) if dto.photo else None,
            bio=Bio(dto.bio) if dto.bio else None,
        )

    @staticmethod
    def from_update_dto(dto: UserUpdateDTO, current: UserEntity) -> UserEntity:
        return UserEntity(
            id=current.id,
            username=current.username,
            email=current.email,
            password=None,
            first_name=dto.first_name,
            last_name=dto.last_name,
            phone=Phone(dto.phone) if dto.phone else None,
            photo=Photo(dto.photo.name) if dto.photo else None,
            bio=Bio(dto.bio) if dto.bio else None,
            is_active=current.is_active,
        )

    @staticmethod
    def entity_to_dto(entity: UserEntity) -> UserReadDTO:
        if not entity.id:
            msg = "Pegar um usuario sem ID, não é permitido."
            raise ValidationError(msg)

        return UserReadDTO(
            id=entity.id,
            username=entity.username.value,
            email=entity.email.value,
            first_name=entity.first_name,
            last_name=entity.last_name,
            phone=entity.phone.value if entity.phone else None,
            bio=entity.bio.value if entity.bio else None,
            photo=None,
            interests=None,
            is_active=entity.is_active,
        )
