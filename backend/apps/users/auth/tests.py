from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from rest_framework_simplejwt.tokens import RefreshToken
from apps.users.tests import UsersMixin

class AuthTest(APITestCase, UsersMixin):

    # Testando o Login
    def test_login_view_success(self):
        """Testa login bem-sucedido"""
        user = self.make_user(username="testuser", email="testuser@email.com", password="SenhaForte321.")
        api_url = reverse('login')  # Substitua pelo caminho correto

        # Dados de login válidos com email
        valid_data = {
            "email": "testuser@email.com",  # Usando email para login
            "password": "SenhaForte321."
        }

        response = self.client.post(api_url, data=valid_data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access_token", response.cookies)
        self.assertIn("refresh_token", response.cookies)

    def test_login_view_invalid_credentials(self):
        """Testa login com credenciais inválidas"""
        api_url = reverse('login')  # Substitua pelo caminho correto

        # Dados de login inválidos
        invalid_data = {
            "email": "wrongemail@email.com",
            "password": "wrongpassword"
        }

        response = self.client.post(api_url, data=invalid_data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("detail", response.data)

    # Testando o Logout
    def test_logout_view(self):
        """Testa logout e remoção dos cookies"""
        user = self.make_user(username="testuser", email="testuser@email.com", password="SenhaForte321")
        refresh = RefreshToken.for_user(user)

        self.client.cookies["access_token"] = str(refresh.access_token)
        self.client.cookies["refresh_token"] = str(refresh)

        api_url = reverse('logout')  # Substitua pelo caminho correto
        response = self.client.post(api_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.cookies["access_token"].value, "")
        self.assertEqual(response.cookies["refresh_token"].value, "")

    # Testando o Refresh
    def test_refresh_view_success(self):
        """Testa refresh token válido"""
        user = self.make_user(username="testuser", email="testuser@email.com", password="SenhaForte321")
        refresh = RefreshToken.for_user(user)
        print(refresh)
        self.client.cookies["refresh_token"] = str(refresh)

        api_url = reverse('refresh')  # Substitua pelo caminho correto
        response = self.client.post(api_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access_token", response.cookies)

    def test_refresh_view_invalid_token(self):
        """Testa refresh com token inválido"""
        self.client.cookies["refresh_token"] = "invalid_token"

        api_url = reverse('refresh')  # Substitua pelo caminho correto
        response = self.client.post(api_url)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
