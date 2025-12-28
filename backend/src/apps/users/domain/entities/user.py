from dataclasses import dataclass

from core.domain.entities.base import Entity


@dataclass
class UserEntity(Entity):
    id: int
    username: str
    first_name: str
    last_name: str
    email: str
    phone: str | None
    bio: str | None
    photo: str | None
    interests: list[int] | None
    is_active: bool


@dataclass
class NewUserEntity(Entity):
    username: str
    first_name: str
    last_name: str
    password: str
    email: str
    phone: str | None
    bio: str | None
    photo: str | None
    interests: list[int] | None
