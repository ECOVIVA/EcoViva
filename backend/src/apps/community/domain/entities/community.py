from __future__ import annotations

from dataclasses import dataclass, field
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from datetime import datetime


@dataclass
class CommunityEntity:
    id: int | None
    name: str
    slug: str
    description: str

    owner_id: int
    is_private: bool

    admins: set[int] = field(default_factory=set)  # type: ignore
    members: set[int] = field(default_factory=set)  # type: ignore
    pending_requests: set[int] = field(default_factory=set)  # type: ignore

    created_at: datetime | None = None

    def add_admin(self, user_id: int) -> None:
        self.admins.add(user_id)
        self.members.add(user_id)

    def request_membership(self, user_id: int) -> None:
        if not self.is_private:
            self.members.add(user_id)
            return

        self.pending_requests.add(user_id)

    def approve_member(self, user_id: int) -> None:
        if user_id not in self.pending_requests:
            msg = "User is not in pending requests."
            raise ValueError(msg)

        self.pending_requests.remove(user_id)
        self.members.add(user_id)

    def deny_member(self, user_id: int) -> None:
        self.pending_requests.discard(user_id)

    def is_admin(self, user_id: int) -> bool:
        return user_id == self.owner_id or user_id in self.admins

    def is_member(self, user_id: int) -> bool:
        return user_id in self.members
