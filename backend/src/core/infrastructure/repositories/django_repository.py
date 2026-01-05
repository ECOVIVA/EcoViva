from django.db.models import Model, QuerySet

from core.domain.exceptions import NotFoundError


class DjangoORMRepository[M: Model]:
    def __init__(self, model: type[M]) -> None:
        self.model: type[M] = model

    def save(self, instance: M, **data: object) -> M:
        for attr, value in data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance

    def get(self, **filters: object) -> M:
        try:
            return self.model.objects.get(**filters)
        except self.model.DoesNotExist as e:
            name = self.model._meta.verbose_name
            raise NotFoundError(f"{name} não foi encontrado.") from e

    def list(self, **filters: object) -> QuerySet[M]:
        return self.model.objects.filter(**filters)
