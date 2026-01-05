from collections.abc import Iterable
from typing import Protocol, TypeVar

T = TypeVar("T")


class ORMRepository(Protocol[T]):
    def save(self, instance: T) -> T: ...

    def get(self, **filters: object) -> T: ...

    def list(self, **filters: object) -> Iterable[T]: ...
