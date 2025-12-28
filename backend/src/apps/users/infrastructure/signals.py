import os

from django.db import models
from django.dispatch import receiver

from apps.users.infrastructure.models.interests import Interests
from apps.users.infrastructure.models.user import Users
from utils.image import resize_image_preserve_aspect_ratio


@receiver(models.signals.post_save, sender=Users)
def resize_photo_image(sender: Users, instance: Users, **kwargs: object) -> None:
    if instance.photo:
        photo_path = instance.photo.path
        resize_image_preserve_aspect_ratio(photo_path, 450, 450)


@receiver(models.signals.post_delete, sender=Users)
def deletar_imagem_apos_excluir(sender: Users, instance: Users, **kwargs: object) -> None:
    if instance.photo and os.path.isfile(instance.photo.path):
        os.remove(instance.photo.path)


@receiver(models.signals.pre_save, sender=Users)
def delete_old_image(sender: Users, instance: Users, **kwargs: object) -> None:
    if not instance.pk:
        return

    try:
        old_instance = sender.objects.get(pk=instance.pk)
    except sender.DoesNotExist:
        return

    if (
        old_instance.photo
        and old_instance.photo != instance.photo
        and os.path.isfile(old_instance.photo.path)
    ):
        os.remove(old_instance.photo.path)


@receiver(models.signals.post_migrate)
def create_interests(sender: object, **kwargs: object) -> None:
    sustainability_interests = [
        "Reciclagem",
        "Compostagem",
        "Reflorestamento",
        "Economia Circular",
        "Redução de Plástico",
        "Conservação da Água",
        "Energias Renováveis",
        "Consumo Consciente",
        "Mobilidade Sustentável",
        "Agricultura Sustentável",
        "Preservação da Biodiversidade",
        "Gestão de Resíduos",
        "Moda Sustentável",
        "Arquitetura Verde",
        "Alimentação Sustentável",
        "Poluição e Controle Ambiental",
        "Ecoeducação",
        "Mudanças Climáticas",
        "Produção Limpa",
        "Zero Waste (Lixo Zero)",
    ]

    for name in sustainability_interests:
        Interests.objects.get_or_create(name=name)
