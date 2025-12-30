from dataclasses import dataclass
from typing import BinaryIO


@dataclass(frozen=True)
class UserWriteDTO:
    username: str
    first_name: str
    last_name: str
    password: str
    email: str
    phone: str | None
    bio: str | None
    photo: BinaryIO | None
    interests: list[int] | None


@dataclass(frozen=True)
class UserUpdateDTO:
    first_name: str
    last_name: str
    photo: BinaryIO | None
    phone: str | None = None
    bio: str | None = None


@dataclass(frozen=True)
class UserReadDTO:
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
