from django.core.validators import FileExtensionValidator
from django.db import models
from django.utils import timezone

from apps.users.infrastructure.models.user import Users
from utils.image import validate_image_size

from .community import Community


class Tags(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self) -> str:
        return self.name


class Thread(models.Model):
    community = models.ForeignKey(Community, on_delete=models.CASCADE)
    cover = models.ImageField(
        upload_to="threads_cover",
        validators=[
            FileExtensionValidator(allowed_extensions=["jpg", "jpeg", "png"]),
            validate_image_size,
        ],
        null=True,
        blank=True,
    )
    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, blank=False)
    content = models.TextField()
    likes = models.ManyToManyField(Users, related_name="liked_threads", blank=True)  # type: ignore
    tags = models.ManyToManyField(Tags, blank=True)  # type: ignore
    author = models.ForeignKey(Users, on_delete=models.CASCADE)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return self.title


class Post(models.Model):
    thread = models.ForeignKey(Thread, on_delete=models.CASCADE, related_name="posts")
    content = models.TextField()
    author = models.ForeignKey(Users, on_delete=models.CASCADE)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return f'Post de {self.author.username} em "{self.thread.title}"'
