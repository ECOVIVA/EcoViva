from apps.study.models import Achievement, AchievementLog, LessonLog
from apps.users.models import Users
from apps.bubble.models import CheckIn
from django.utils.timezone import now, timedelta

def user_checkin_initial(user):
    return CheckIn.objects.filter(user=user).exists()

def user_completed_lesson_count(user):
    return LessonLog.objects.filter(user=user).count()

def user_checkin_streak(user):
    checkins = CheckIn.objects.filter(user=user).order_by('-date')[:7]
    expected_day = now().date()
    streak = 0
    for checkin in checkins:
        if checkin.date == expected_day:
            streak += 1
            expected_day -= timedelta(days=1)
        else:
            break
    return streak

def user_score(user):
    return Users.objects.get(id=user.id).score

# Mapeamento das condições para suas funções
CONDITION_HANDLERS = {
    "checkin_initial": lambda user: user_checkin_initial(user) == True,
    "checkin_7_days": lambda user: user_checkin_streak(user) >= 7,
    "score_100": lambda user: user_score(user) >= 100,
    "completed_5_lessons": lambda user: user_completed_lesson_count(user) >= 5,
}

def check_achievements_for_user(user):
    unlocked = []  # Lista para armazenar conquistas recém-desbloqueadas

    try:
        for achievement in Achievement.objects.all():
            if AchievementLog.objects.filter(user=user, achievement=achievement).exists():
                continue  # Já desbloqueada

            condition = achievement.condition
            handler = CONDITION_HANDLERS.get(condition)

            if handler and handler(user):
                AchievementLog.objects.create(user=user, achievement=achievement)
                unlocked.append(achievement)  # Adiciona à lista

    except Exception as e:
        print(f"[Erro em check_achievements_for_user]: {e}")

    return unlocked  # Retorn