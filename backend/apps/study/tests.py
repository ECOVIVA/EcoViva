from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from apps.users.tests import UsersMixin
from apps.study.models import LessonCompletion, Lesson, Achievement, AchievementRule, UserAchievement
from apps.bubble.models import Bubble, CheckIn


class TestLessions(APITestCase, UsersMixin):
    def setUp(self):
        self.user = self.make_user()
        self.client.force_authenticate(user=self.user)  

        self.lesson = Lesson.objects.create(title="Lição Teste")
        self.lesson2 = Lesson.objects.create(title="Lição Teste 2")

        self.lesson_completion = LessonCompletion.objects.create(user=self.user, lesson=self.lesson)

        self.achievement = Achievement.objects.create(name = "Conquista")
        self.achievement_rules = AchievementRule.objects.create(achievement = self.achievement, required_lessons = 1)

    def test_get_lesson_completions_success(self):
        """Testa se retorna corretamente as lições concluídas do usuário autenticado"""
        url = reverse("study:lessons_complete")  # Ajuste conforme sua URL
        
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)  # Deve retornar um item
        self.assertEqual(response.data[0]["lesson"], self.lesson.id)

    def test_get_lesson_completions_no_lessons(self):
        """Testa se retorna 404 caso o usuário não tenha concluído nenhuma lição"""
        self.lesson_completion.delete()  # Remove a conclusão para testar esse cenário
        
        url = reverse("study:lessons_complete")  
        
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data, {"detail": "Este usuario não comletou nenhuma lição."})

    def test_post_lesson_completion_success(self):
        """Testa a criação de um novo registro de lição concluída"""
        url = reverse("study:lesson_complete_create")  # Ajuste conforme sua URL

        self.lesson_completion.delete() 
        payload = {"lesson": self.lesson.pk}  # Informando a lição concluída
        
        response = self.client.post(url, data=payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data, "A lição foi registrada como completada!!")

        # Verificando se foi criado no banco de dados
        self.assertEqual(LessonCompletion.objects.count(), 1)
        self.assertEqual(UserAchievement.objects.filter(user=self.user).count(), 1)

    def test_post_lesson_for_test_duplicate_archivement(self):
        """Testa a criação de um novo registro de lição concluída"""
        url = reverse("study:lesson_complete_create")  # Ajuste conforme sua URL

        self.lesson_completion.delete() 
        payload1 = {"lesson": self.lesson.pk}
        payload2 = {"lesson": self.lesson2.pk}

        response1 = self.client.post(url, data=payload1, format="json")
        response2 = self.client.post(url, data=payload2, format="json")

        self.assertEqual(UserAchievement.objects.filter(user=self.user).count(), 1)

    def test_post_lesson_completion_without_lesson(self):
        """Testa a tentativa de criar um registro sem informar a lição"""
        url = reverse("study:lesson_complete_create")

        payload = {}  # Não informando a lição

        response = self.client.post(url, data=payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, {"detail": "Informe qual foi a lição completada."})

    def test_post_duplicate_lesson_completion(self):
        """Testa se impede a criação duplicada de uma conclusão para a mesma lição"""
        url = reverse("study:lesson_complete_create")

        payload = {"lesson": self.lesson.id}

        response1 = self.client.post(url, data=payload, format="json")
        response2 = self.client.post(url, data=payload, format="json")  # Tentativa duplicada

        self.assertEqual(response2.status_code, status.HTTP_400_BAD_REQUEST)

    def test_get_achivements_list(self):
        url = reverse("study:achivements_user")

        response = self.client.get(url, format="json")  # Tentativa duplicada

        self.assertEqual(response.status_code, status.HTTP_200_OK)