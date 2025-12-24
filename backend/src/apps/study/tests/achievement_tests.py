from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from apps.users.tests import UsersMixin
from apps.study.models.achievement import Achievement

class TestLessions(APITestCase, UsersMixin):
    def setUp(self):
        self.user = self.make_user()

        self.badge = Achievement.objects.create(**{
            'name': 'Teste',
            'category': 'Lesson',
            'condition': 'lesson_initial',
            'description': 'Teste'
        })

    
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