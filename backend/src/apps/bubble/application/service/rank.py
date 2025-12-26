class RankService:
    def create_default_ranks() -> None:
        for difficulty in DIFFICULTIES:
            DifficultyRepository.create_difficulty(
                name=difficulty.name, points=difficulty.points_for_activity
            )

        for rank in RANKS:
            RankRepository.create_rank(
                name=rank.name, diff_name=rank.difficulty, points=rank.points
            )

    def upgrade_rank(self, bubble) -> None:
        RankRepository.update_rank(self.bubble)
