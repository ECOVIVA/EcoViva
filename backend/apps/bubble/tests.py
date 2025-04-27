from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from apps.users.tests import UsersMixin
from apps.users.models import Users  
from apps.study.models import Achievement, AchievementLog
from apps.bubble.models import Bubble,CheckIn

"""
    Area Responsável por testar as funcionalidades da API, detectar erros e indentifica-los, de modo
    que o desenvolvimento ocorra com o minimo de erros possíveis

    Este arquivo é o responsável por testar as funcionalidades das views: "BubbleView", "CheckInView", 
    "CheckInDetailView"
"""

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
    


class CheckInViewTest(APITestCase, UsersMixin):
    def setUp(self):
        # Criando um usuário de teste
        self.user = self.make_user()
        self.user2 = self.make_user_not_autenticated()
        
        # Criando uma bolha associada ao usuário
        self.bubble = Bubble.objects.filter(user = self.user.pk).first()

        self.badge = Achievement.objects.create(**{
            'name': 'Teste',
            'category': 'Check-In',
            'condition': 'checkin_initial',
            'description': 'Teste'
        })

    def test_post_checkin(self):
        url = reverse('users:bubble:check_in_create')

        payload = {
            "description": "ALGO ACONTECEU",
        }

        response = self.client.post(url, data=payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.json().get('detail'), 'Check-in criado com sucesso!')
        self.assertEqual(response.json().get('new_badges')[0].get('name'), 'Teste')


    def test_post_checkin_fail_for_unauthorized(self):
        url = reverse('users:bubble:check_in_create')
        
        self.client.logout()

        payload = {
            "description": "ALGO ACONTECEU",
        }

        response = self.client.post(url, data=payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response.json().get('detail'), 'As credenciais de autenticação não foram fornecidas.')

    def test_post_checkin_fail_for_created_at(self):
        url = reverse('users:bubble:check_in_create')

        payload = {
            "description": "Primeiro check-in",
        }

        self.client.post(url, data=payload, format="json")

        response = self.client.post(url, data=payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(
            response.json().get('non_field_errors')[0], 'Um novo Check-in só pode ser feito após 24 horas.'
        )

    def test_post_checkin_fail_for_unauthorized(self):
        url = reverse('users:bubble:check_in_create')  # Ajuste conforme o seu URL

        self.client.logout()
        payload = {
            "description": "ALGO ACONTECEU",  # 🔹 Corrigido para minúsculas
        }

        response = self.client.post(url, data=payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response.json().get('detail'), 'As credenciais de autenticação não foram fornecidas.')

    def test_increment_progress(self):
        """Deve incrementar o progresso da bolha ao criar um CheckIn"""
        self.assertEqual(self.bubble.progress, 0)

        CheckIn.objects.create(bubble=self.bubble, xp_earned = self.bubble.rank.difficulty.points_for_activity)

        self.bubble.refresh_from_db()
        self.assertEqual(self.bubble.progress, 50)

    def test_upgrade_rank(self):
        """Deve mudar o rank da bolha se progresso atingir novo rank"""
        # Primeiro, a bolha está com rank1 e 10 pontos levam para o rank2
        self.bubble.progress = 100
        self.bubble.save()

        CheckIn.objects.create(bubble=self.bubble, xp_earned = self.bubble.rank.difficulty.points_for_activity)

        self.bubble.refresh_from_db()
        self.assertEqual(self.bubble.rank.pk, 2)
        self.assertEqual(self.bubble.progress, 0)