import os

from django.db.models.signals import post_delete, post_save, pre_save
from django.dispatch import receiver

from apps.community.infrastructure.models.community import Community
from utils.image import resize_image_preserve_aspect_ratio


@receiver(post_save, sender=Community)
def ensure_owner_is_admin(
    sender: type[Community],
    instance: Community,
    **kwargs: object,
) -> None:
    if instance.owner and instance.owner not in instance.admins.all():
        instance.admins.add(instance.owner)
        instance.members.add(instance.owner)


@receiver(post_delete, sender=Community)
def delete_images_after_delete(
    sender: type[Community],
    instance: Community,
    **kwargs: object,
) -> None:
    for image_field in (instance.banner, instance.icon):
        if image_field and hasattr(image_field, "path") and os.path.isfile(image_field.path):
            os.remove(image_field.path)


@receiver(pre_save, sender=Community)
def delete_old_images_on_update(
    sender: type[Community],
    instance: Community,
    **kwargs: object,
) -> None:
    if not instance.pk:
        return

    try:
        old_instance: Community = sender.objects.get(pk=instance.pk)
    except sender.DoesNotExist:
        return

    for field_name in ("banner", "icon"):
        old_file = getattr(old_instance, field_name)
        new_file = getattr(instance, field_name)

        if (
            old_file
            and old_file != new_file
            and hasattr(old_file, "path")
            and os.path.isfile(old_file.path)
        ):
            os.remove(old_file.path)


@receiver(post_save, sender=Community)
def resize_community_images(
    sender: type[Community],
    instance: Community,
    **kwargs: object,
) -> None:
    if instance.banner:
        resize_image_preserve_aspect_ratio(
            instance.banner.path,
            width=800,
            height=600,
        )

    if instance.icon:
        resize_image_preserve_aspect_ratio(
            instance.icon.path,
            width=250,
            height=250,
        )
