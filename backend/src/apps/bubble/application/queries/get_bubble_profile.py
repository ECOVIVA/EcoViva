from apps.bubble.domain.dtos.bubble_profile import BubbleProfileDTO, CheckProfileInDTO
from apps.bubble.infrastructure.repositories.bubble import BubbleRepository
from apps.bubble.infrastructure.repositories.checkin import CheckInRepository
from apps.bubble.infrastructure.repositories.difficulty import DifficultyRepository
from apps.bubble.infrastructure.repositories.rank import RankRepository


class GetBubbleProfile:
    def execute(self, user_id: int) -> BubbleProfileDTO:
        bubble = BubbleRepository().get_bubble_by_user(user_id)
        check_ins = CheckInRepository().list_by_bubble_id(bubble.id)
        rank = RankRepository().get_rank_by_pk(bubble.rank_id)
        diff = DifficultyRepository().get_difficulty_by_pk(rank.difficulty_id)

        return BubbleProfileDTO(
            user_id=bubble.user_id,
            progress=bubble.progress.value,
            rank_name=rank.name,
            difficulty_name=diff.name,
            check_ins=[
                CheckProfileInDTO(
                    description=ci.description,
                    created_at=ci.created_at,
                    xp_earned=ci.xp_earned,
                )
                for ci in check_ins
            ],
        )
