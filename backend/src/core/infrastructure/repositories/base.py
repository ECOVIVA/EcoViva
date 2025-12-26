from abc import ABC, abstractmethod

from django.db.models import Model
from django.db.models.query import QuerySet

from core.domain.entities.base import Entity
from core.domain.exceptions import NotFoundError


class BaseRepository[E: Entity, M: Model](ABC):
    model: M
    entity: E

    def _get_model(self, **filters: object) -> M:
        try:
            return self.model.objects.get(**filters)
        except self.model.DoesNotExist as e:
            error_msg = f"{self.model._meta.verbose_name} não foi encontrado."  # noqa: SLF001
            raise NotFoundError(error_msg) from e

    def _list_model(self, **filters: object) -> QuerySet[M]:
        return self.model.objects.filter(**filters)

    def _get(self, **filters: object) -> E:
        model = self._get_model(**filters)
        return self._to_entity(model)

    def _list(self, **filters: object) -> list[E]:
        models = self._list_model(**filters)
        return [self._to_entity(model) for model in models]

    def _create(self, **data: object) -> E:
        model = self.model.objects.create(**data)
        return self._to_entity(model)

    def _update(self, pk: int, **data: object) -> E:
        model = self._get_model(pk=pk)
        model.objects.update(**data)
        return self._to_entity(model)

    @abstractmethod
    def _to_entity(self, model: M) -> E:
        pass

    @abstractmethod
    def save(self, entity: E) -> None:
        pass
