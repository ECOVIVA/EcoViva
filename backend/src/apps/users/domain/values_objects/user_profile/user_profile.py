from dataclasses import dataclass

from apps.users.domain.values_objects.user_profile.bio import Bio
from apps.users.domain.values_objects.user_profile.email import Email
from apps.users.domain.values_objects.user_profile.phone import Phone
from apps.users.domain.values_objects.user_profile.photo import Photo
from apps.users.domain.values_objects.user_profile.username import Username


@dataclass
class UserProfile:
    username: Username
    email: Email
    first_name: str
    last_name: str
    phone: Phone | None
    photo: Photo | None
    bio: Bio | None
