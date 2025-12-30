from dataclasses import dataclass

from apps.users.domain.values_objects.bio import Bio
from apps.users.domain.values_objects.email import Email
from apps.users.domain.values_objects.password import Password
from apps.users.domain.values_objects.phone import Phone
from apps.users.domain.values_objects.photo import Photo
from apps.users.domain.values_objects.username import Username


@dataclass
class UserEntity:
    id: int | None
    username: Username
    email: Email
    password: Password | None
    first_name: str
    last_name: str
    phone: Phone | None
    photo: Photo | None
    bio: Bio | None
    is_active: bool = False
