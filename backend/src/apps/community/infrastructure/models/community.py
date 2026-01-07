from typing import TYPE_CHECKING, ClassVar

from django.core.validators import FileExtensionValidator
from django.db import models

from apps.users.infrastructure.models.user import Users
from utils.image import validate_image_size

if TYPE_CHECKING:
    from django.db.models.manager import RelatedManager


class Community(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=120, unique=True, blank=True)
    description = models.TextField()

    banner = models.ImageField(upload_to="community_banners/", blank=True, null=True)

    icon = models.ImageField(
        upload_to="community_icons/",
        blank=True,
        null=True,
        validators=[
            FileExtensionValidator(["jpg", "jpeg", "png"]),
            validate_image_size,
        ],
    )

    owner = models.ForeignKey(
        Users,
        on_delete=models.CASCADE,
        related_name="owned_communities",
    )

    admins = models.ManyToManyField(  # type: ignore
        Users,
        blank=True,
        related_name="admin_communities",
    )

    members = models.ManyToManyField(  # type: ignore
        Users,
        blank=True,
        related_name="member_communities",
    )

    pending_requests = models.ManyToManyField(  # type: ignore
        Users,
        blank=True,
        related_name="pending_communities",
    )

    is_private = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    admins: "RelatedManager[Users]"
    members: "RelatedManager[Users]"
    pending_requests: "RelatedManager[Users]"

    class Meta:
        verbose_name = "Community"
        verbose_name_plural = "Communities"
        ordering: ClassVar[list[str]] = ["-created_at"]

    def __str__(self) -> str:
        return self.name
