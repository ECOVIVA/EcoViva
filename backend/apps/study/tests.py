from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from apps.users.tests import UsersMixin
from apps.study.models import LessonLog, Lesson, Achievement, AchievementLog
from apps.bubble.models import Bubble, CheckIn


class TestLessions(APITestCase, UsersMixin):
    def setUp(self):
        self.user = self.make_user()

        self.lesson = Lesson.objects.create(title="Lição Teste")
        self.lesson2 = Lesson.objects.create(title="Lição Teste 2")

        self.lesson_log = LessonLog.objects.create(user=self.user, lesson=self.lesson)

        self.badge = Achievement.objects.create(**{
            'name': 'Teste',
            'category': 'Lesson',
            'condition': 'lesson_initial',
            'description': 'Teste'
        })

    def test_get_lesson_log(self):
        """Testa se retorna corretamente as lições concluídas do usuário autenticado"""
        url = reverse("study:lessons_complete")  # Ajuste conforme sua URL
        
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()[0].get('lesson'), self.lesson.id)

    def test_get_lesson_log_fail_for_404(self):
        """Testa se retorna 404 caso o usuário não tenha concluído nenhuma lição"""
        url = reverse("study:lessons_complete") 

        self.lesson_log.delete()
        
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.json().get('detail'), "Este usuário não completou nenhuma lição.")

    def test_get_lesson_log_fail_for_unauthorizated(self):
        url = reverse("study:lessons_complete") 

        self.client.logout()
        
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_post_lesson_log(self):
        """Testa a criação de um novo registro de lição concluída"""
        url = reverse("study:lesson_complete_create")  # Ajuste conforme sua URL

        self.lesson_log.delete() 

        payload = {"lesson": self.lesson.pk}  # Informando a lição concluída
        
        response = self.client.post(url, data=payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.json(), "A lição foi registrada como completada!!")

    def test_post_lesson_log_fail_for_blank(self):
        """Testa a tentativa de criar um registro sem informar a lição"""
        url = reverse("study:lesson_complete_create")

        payload = {}  # Não informando a lição

        response = self.client.post(url, data=payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.json().get('detail'), "Informe qual foi a lição completada.")

    def test_post_duplicate_lesson_completion(self):
        """Testa se impede a criação duplicada de uma conclusão para a mesma lição"""
        url = reverse("study:lesson_complete_create")

        payload = {"lesson": self.lesson.id}

        response1 = self.client.post(url, data=payload, format="json")
        response2 = self.client.post(url, data=payload, format="json")  # Tentativa duplicada

        self.assertEqual(response2.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response2.json().get('non_field_errors')[0], 'Os campos user, lesson devem criar um set único.')

    def test_post_unauthorized(self):
        url = reverse("study:lesson_complete_create")

        self.client.logout()

        payload = {"lesson": self.lesson.id}

        response = self.client.post(url, data=payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response.json().get('detail'), 'As credenciais de autenticação não foram fornecidas.')


    def test_get_achivements_list(self):
        url = reverse("study:achievements_user")

        response = self.client.get(url, format="json")  

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_achivements_list_unauthorized(self):
        url = reverse("study:achievements_user")

        self.client.logout()
        response = self.client.get(url, format="json")  

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response.json().get('detail'), 'As credenciais de autenticação não foram fornecidas.')