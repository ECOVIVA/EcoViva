from django.contrib.auth.models import AbstractUser
from django.core.validators import FileExtensionValidator
from django.db import models

from apps.users.infrastructure.manager import UsersManager
from apps.users.infrastructure.models.interests import Interests
from utils.image import validate_image_size


class Users(AbstractUser):
    class Meta:
        app_label = "users"
        verbose_name = "User"
        verbose_name_plural = "Users"

    email = models.EmailField(unique=True, blank=False, null=False)
    bio = models.TextField(max_length=256, null=True, default=None)
    interests: models.ManyToManyField["Interests", models.Model] = models.ManyToManyField(
        Interests,
        blank=True,
    )
    phone = models.CharField(max_length=15, blank=False, null=False)
    photo = models.ImageField(
        upload_to="users_photos",
        validators=[
            FileExtensionValidator(allowed_extensions=["jpg", "jpeg", "png"]),
            validate_image_size,
        ],
        null=True,
        blank=True,
    )
    is_active = models.BooleanField(default=False)
    objects = UsersManager  # type: ignore

    groups = None
    user_permissions = None

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = "username", "phone"  # type: ignore

    def __str__(self) -> str:
        return f"User {self.username}"
