from django.db import models

from apps.users.infrastructure.models.user import Users

from .community import Community


class Challenge(models.Model):
    class Meta:
        verbose_name = "Desafio"
        verbose_name_plural = "Desafios"
        ordering = ("-created_at",)

    community = models.ForeignKey(
        Community,
        on_delete=models.CASCADE,
        related_name="challenges",
        verbose_name="Community",
    )

    created_by = models.ForeignKey(
        Users,
        on_delete=models.SET_NULL,
        null=True,
        related_name="challenges_created",
        verbose_name="Created By",
    )

    image = models.ImageField(upload_to="challenges/", blank=True, null=True)
    title = models.CharField(max_length=100, verbose_name="Title")
    description = models.TextField(verbose_name="Description")

    status = models.CharField(
        max_length=30,
        verbose_name="Status",
    )

    metal_points = models.PositiveIntegerField(verbose_name="Metal Points")
    paper_points = models.PositiveIntegerField(verbose_name="Paper Points")
    plastic_points = models.PositiveIntegerField(verbose_name="Plastic Points")
    glass_points = models.PositiveIntegerField(verbose_name="Glass Points")

    deadline = models.DateTimeField(verbose_name="Deadline")

    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Created At")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Updated At")

    def __str__(self) -> str:
        return self.title
