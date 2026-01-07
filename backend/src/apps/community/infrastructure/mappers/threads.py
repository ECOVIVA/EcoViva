from apps.community.domain.entities.threads import ThreadsEntity
from apps.community.infrastructure.models.threads import Thread


class ThreadsDjangoMapper:
    def to_entity(self, model: Thread) -> ThreadsEntity: ...

    def to_model(self, entity: ThreadsEntity) -> Thread: ...
