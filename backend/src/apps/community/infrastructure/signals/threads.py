import os

from django.db.models.signals import post_delete, post_save, pre_save
from django.dispatch import receiver

from apps.community.infrastructure.models.threads import Thread


@receiver(post_delete, sender=Thread)
def delete_cover_image_after_delete(
    sender: type[Thread],
    instance: Thread,
    **kwargs: object,
) -> None:
    if instance.cover and hasattr(instance.cover, "path") and os.path.isfile(instance.cover.path):
        os.remove(instance.cover.path)


@receiver(pre_save, sender=Thread)
def delete_old_cover_image_on_update(
    sender: type[Thread],
    instance: Thread,
    **kwargs: object,
) -> None:
    if not instance.pk:
        return

    try:
        old_instance: Thread = sender.objects.get(pk=instance.pk)
    except sender.DoesNotExist:
        return

    if (
        old_instance.cover
        and old_instance.cover != instance.cover
        and hasattr(old_instance.cover, "path")
        and os.path.isfile(old_instance.cover.path)
    ):
        os.remove(old_instance.cover.path)


@receiver(post_save, sender=Thread)
def resize_thread_cover_image(
    sender: type[Thread],
    instance: Thread,
    **kwargs: object,
) -> None:
    if instance.cover:
        resize_image_preserve_aspect_ratio(
            instance.cover.path,
            width=800,
            height=600,
        )
