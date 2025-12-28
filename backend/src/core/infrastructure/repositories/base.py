from abc import ABC, abstractmethod

from django.db.models import Model
from django.db.models.query import QuerySet

from core.domain.entities.base import Entity
from core.domain.exceptions import NotFoundError

E: Entity
M: Model


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

    @abstractmethod
    def _to_entity(self, model: M) -> E:
        pass


class RepositoryWrite[E: Entity, NewE: Entity]:
    def create(self, entity: NewE) -> E:
        raise NotImplementedError(f"{self.__class__.__name__} não implementa create()")  # noqa

    def update(self, entity: E) -> E:
        raise NotImplementedError(f"{self.__class__.__name__} não implementa update()")  # noqa
