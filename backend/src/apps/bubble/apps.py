from django.apps import AppConfig


class BolhaConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.bubble"

    def ready(self) -> None:
        import apps.bubble.infrastructure.signals  # noqa: F401 #type: ignore
