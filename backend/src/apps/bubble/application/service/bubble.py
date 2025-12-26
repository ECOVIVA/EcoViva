class BubbleService:
    def calculate_bubble_difficulty(self, bubble) -> None:
        DifficultyRepository.get_difficulty_by_pk(bubble.difficulty_id)

    def increment_points_for_bubble(self) -> None:
        CheckInRepository.increment_points_for_bubble(self.check_in)

    def execute(self) -> None:
        RankRepository.update_rank(self.bubble)
