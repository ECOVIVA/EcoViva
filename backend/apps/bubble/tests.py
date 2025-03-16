from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from apps.users.tests import UsersMixin
from apps.users.models import Users  # ou o caminho correto para o seu model de usuários
from apps.bubble.models import Bubble, CheckIn

"""
    Area Responsável por testar as funcionalidades da API, detectar erros e indentifica-los, de modo
    que o desenvolvimento ocorra com o minimo de erros possíveis

    Este arquivo é o responsável por testar as funcionalidades das views: "BubbleView", "CheckInView", 
    "CheckInDetailView"
"""

class BubbleViewTests(APITestCase):
    def setUp(self):
        # Criando um usuário de teste
        self.user = Users.objects.create_user(
            username='testuser',
            password='testpassword',
            email='testuser@email.com',
            phone='(11) 99999-9999'
        )

        # Criando uma bolha associada ao usuário
        self.bubble = Bubble.objects.create(user=self.user)

    def test_get_bubble_for_user(self):
        # Realizando a requisição GET para obter a bolha associada ao usuário
        url = reverse('users:bubble:bubble', args=[self.user.username])  # Ajuste conforme o seu URL
        response = self.client.get(url)

        # Verificando se o status da resposta é 200 OK
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_bubble_not_found(self):
        # Tentando obter a bolha de um usuário que não existe
        url = reverse('users:bubble:bubble', args=['nonexistentuser'])
        response = self.client.get(url)

        # Verificando se a resposta retorna o status 404 Not Found
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND) 

class CheckInViewTest(APITestCase,UsersMixin):
    def setUp(self):
        # Criando um usuário de teste
        self.user = self.make_user()
        self.user2 = self.make_user_for_comparison()


        # Criando uma bolha associada ao usuário
        self.bubble = Bubble.objects.create(user=self.user)
        self.bubble2 = Bubble.objects.create(user=self.user2)

        # Criando uma bolha associada ao usuário
        self.check_in = CheckIn.objects.create(bubble = self.bubble)


    def test_get_checkin_for_user(self):
        url = reverse('users:bubble:check_in', args=[self.user.username])  # Ajuste conforme o seu URL
        response = self.client.get(url)

        # Verificando se o status da resposta é 200 OK
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_post_checkin(self):
        url = reverse('users:bubble:check_in_create', args=[self.user2.username])  # Ajuste conforme o seu URL

        payload = {
            "bubble": self.bubble2.pk,
            "Description": "ALGO ACONTECEU"
        }

        response = self.client.post(url, data=payload, format = "json")

        self.bubble2.refresh_from_db()

        # Verificando se o status da resposta é 201 CREATED
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        bubble = self.bubble2
        self.assertEqual(bubble.progress, 50)

    def test_post_checkin_fail_for_created_at(self):
        url = reverse('users:bubble:check_in_create', args=[self.user.username])  # Ajuste conforme o seu URL

        payload = {
            "bubble": self.bubble.pk,
            "description": "Outro check in no mesmo dia"
        }

        response = self.client.post(url, data=payload, format = "json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.json(), {'non_field_errors': ['Um novo Check-in só pode ser feito após 24 horas.']})

class CheckInDetailViewTest(APITestCase, UsersMixin):
    def setUp(self):
        # Criação de usuário
        self.user = self.make_user('user')

        # Criação de uma bolha associada ao usuário
        self.bubble = Bubble.objects.create(user=self.user)

        # Criação de check-in associado à bolha
        self.check_in = CheckIn.objects.create(bubble=self.bubble, description="Test Check-in")

    def test_get_check_in_detail_success(self):
        """
        Teste de sucesso para obter os detalhes de um check-in.
        """
        url = reverse('users:bubble:check_in_detail', args=[self.user.username, 1])
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['description'], "Test Check-in")

    def test_get_check_in_detail_bubble_not_found(self):
        """
        Teste quando a bolha do usuário não é encontrada.
        """
        url = reverse('users:bubble:check_in_detail', args=["blabla", 1])
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_get_check_in_detail_check_in_not_found(self):
        """
        Teste quando o check-in não é encontrado.
        """
        url = reverse('users:bubble:check_in_detail', args=[self.user.username, 999])
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)