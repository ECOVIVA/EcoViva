from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from apps.users.tests import UsersMixin
from apps.users.models import Users  
from apps.bubble.models import Bubble

"""
    Area Responsável por testar as funcionalidades da API, detectar erros e indentifica-los, de modo
    que o desenvolvimento ocorra com o minimo de erros possíveis

    Este arquivo é o responsável por testar as funcionalidades das views: "BubbleView", "CheckInView", 
    "CheckInDetailView"
"""

class BubbleViewTests(APITestCase, UsersMixin):
    def setUp(self):
        self.user_auth = self.make_user()
        self.user = Users.objects.create_user(
            username='testuser',
            password='testpassword',
            email='testuser@email.com',
            phone='(11) 99999-9999'
        )

        # Criando uma bolha associada ao usuário
        self.bubble_profile = Bubble.objects.create(user=self.user_auth)
        self.bubble = Bubble.objects.create(user=self.user)

    def test_get_bubble_for_user(self):
        # Realizando a requisição GET para obter a bolha associada ao usuário
        url = reverse('users:bubble:bubble:profile')  # Ajuste conforme o seu URL
        response = self.client.get(url)

        # Verificando se o status da resposta é 200 OK
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_bubble_for_user(self):
        # Realizando a requisição GET para obter a bolha associada ao usuário
        url = reverse('users:bubble:bubble', args=['testuser'])  # Ajuste conforme o seu URL
        response = self.client.get(url)

        # Verificando se o status da resposta é 200 OK
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_bubble_not_found(self):
        # Tentando obter a bolha de um usuário que não existe
        url = reverse('users:bubble:bubble', args=['nonexistentuser'])
        response = self.client.get(url)

        # Verificando se a resposta retorna o status 404 Not Found
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND) 

class CheckInViewTest(APITestCase, UsersMixin):
    def setUp(self):
        # Criando um usuário de teste
        self.user = self.make_user()
        self.client.force_authenticate(user=self.user)  # 🔹 Garante autenticação
        
        # Criando uma bolha associada ao usuário
        self.bubble = Bubble.objects.create(user=self.user)

    def test_post_checkin(self):
        url = reverse('users:bubble:check_in_create')  # Ajuste conforme o seu URL

        payload = {
            "description": "ALGO ACONTECEU",  # 🔹 Corrigido para minúsculas
        }

        response = self.client.post(url, data=payload, format="json")

        self.bubble.refresh_from_db()  # 🔹 Atualiza a bolha para refletir mudanças

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        bubble = self.bubble
        self.assertEqual(bubble.progress, 50)  # 🔹 Garante que o progresso aumentou

    def test_post_checkin_fail_for_created_at(self):
        url = reverse('users:bubble:check_in_create')

        payload = {
            "description": "Primeiro check-in",
        }

        self.client.post(url, data=payload, format="json")

        response = self.client.post(url, data=payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(
            response.json(),
            {'non_field_errors': ['Um novo Check-in só pode ser feito após 24 horas.']}
        )
