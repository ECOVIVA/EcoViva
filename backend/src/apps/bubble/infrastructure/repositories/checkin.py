from apps.bubble.infrastructure.model import CheckIn


class CheckInRepository:
    @staticmethod
    def create_checkin(user_id: int, bubble_id: int) -> None:
        CheckIn.objects.create(user_id=user_id, bubble_id=bubble_id)

    @staticmethod
    def increment_points_for_bubble(check_in: CheckIn) -> None:
        bubble = check_in.bubble
        difficulty = bubble.rank.difficulty

        if difficulty:
            bubble.progress += difficulty.points_for_activity
            bubble.save()
