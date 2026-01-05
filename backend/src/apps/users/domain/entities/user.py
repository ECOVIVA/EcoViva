from dataclasses import dataclass

from apps.users.domain.values_objects.password import Password
from apps.users.domain.values_objects.user_profile.user_profile import UserProfile


@dataclass
class UserEntity:
    id: int | None
    profile: UserProfile
    password: Password | None
    is_active: bool = False
