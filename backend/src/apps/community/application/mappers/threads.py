from apps.community.application.dtos.threads import ThreadsDTO
from apps.community.domain.entities.threads import ThreadsEntity


class ThreadsMapper:
    def to_entity(self, dto: ThreadsDTO) -> ThreadsEntity: ...

    def to_dto(self, entity: ThreadsEntity) -> ThreadsDTO: ...
