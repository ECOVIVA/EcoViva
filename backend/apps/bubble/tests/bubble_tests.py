from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from apps.users.tests import UsersMixin

class BubbleViewTests(APITestCase, UsersMixin):
    def setUp(self):
        self.user = self.make_user()
        self.user2 = self.make_user_not_autenticated()        

    def test_get_bubble(self):
        url = reverse('users:bubble:bubble_profile')

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json().get('user'), self.user.pk)

    def test_get_bubble_fail_for_unauthorized(self):
        url = reverse('users:bubble:bubble_profile')

        self.client.logout()
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response.json().get('detail'), 'As credenciais de autenticação não foram fornecidas.')
    