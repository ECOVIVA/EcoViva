class Photo:
    def __init__(self, path: str) -> None:
        self._path = path

    @property
    def value(self) -> str:
        return self._path
