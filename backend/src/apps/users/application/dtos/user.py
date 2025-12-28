from dataclasses import dataclass


@dataclass(frozen=True)
class UserInputDTO:
    username: str
    first_name: str
    last_name: str
    password: str
    email: str
    phone: str | None
    bio: str | None
    photo: str | None
    interests: list[int] | None

    

@dataclass(frozen=True)
class UserOutputDTO:
    id: int
    username: str
    first_name: str
    last_name: str
    email: str
    phone: str | None
    bio: str | None
    photo: str | None
    interests: list[int] | None
    is_active: bool
