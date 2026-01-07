from apps.community.infrastructure.mappers.threads import ThreadsDjangoMapper


class ThreadsRepository:
    def __init__(self, mappper: ThreadsDjangoMapper) -> None:
        self.mapper = mappper
