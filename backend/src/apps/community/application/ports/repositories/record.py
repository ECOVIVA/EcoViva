from apps.community.infrastructure.mappers.record import RecordDjangoMapper


class RecordRepository:
    def __init__(self, mappper: RecordDjangoMapper) -> None:
        self.mapper = mappper
