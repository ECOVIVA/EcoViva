from apps.study.models import Achievement, AchievementLog, LessonLog
from apps.users.models import Users
from apps.bubble.models.checkin import CheckIn
from django.utils.timezone import now, timedelta

class CheckAchievements:
    CONDITION_HANDLERS = {}

    @classmethod
    def register_handlers(cls, handlers):
        cls.CONDITION_HANDLERS.update(handlers)

    @staticmethod
    def check_achievements_for_user(user):
        unlocked = []  # Conquistas recém-desbloqueadas

        try:
            for achievement in Achievement.objects.all():
                if AchievementLog.objects.filter(user=user, achievement=achievement).exists():
                    continue  # Já desbloqueada

                condition = achievement.condition
                handler = CheckAchievements.CONDITION_HANDLERS.get(condition)

                if handler and handler(user):
                    AchievementLog.objects.create(user=user, achievement=achievement)
                    unlocked.append(achievement)

        except Exception as e:
            print(f"[Erro em check_achievements_for_user]: {e}")

        return unlocked


# ----------------------------------------
# Handlers para conquistas de Check-in
# ----------------------------------------

class CheckAchievementsCheckIn(CheckAchievements):
    @staticmethod
    def user_checkin_initial(user):
        return CheckIn.objects.filter(bubble__user=user).exists()

    @staticmethod
    def user_checkin_streak(user):
        checkins = CheckIn.objects.filter(bubble__user=user).order_by('-date')
        expected_day = now().date()
        streak = 0
        for checkin in checkins:
            if checkin.date == expected_day:
                streak += 1
                expected_day -= timedelta(days=1)
            else:
                break
        return streak


CheckAchievements.register_handlers({
    "checkin_initial": CheckAchievementsCheckIn.user_checkin_initial,
    "checkin_7_days": lambda user: CheckAchievementsCheckIn.user_checkin_streak(user) >= 7,
})


# ----------------------------------------
# Handlers para conquistas de Lições
# ----------------------------------------

class CheckAchievementsLesson(CheckAchievements):
    @staticmethod
    def user_completed_lesson_count(user):
        return LessonLog.objects.filter(user=user).count()

    @staticmethod
    def user_lesson_initial(user):
        return LessonLog.objects.filter(user=user).exists()

CheckAchievements.register_handlers({
    "lesson_initial": lambda user: CheckAchievementsLesson.user_lesson_initial(user),
    "completed_5_lessons": lambda user: CheckAchievementsLesson.user_completed_lesson_count(user) >= 5,
})
