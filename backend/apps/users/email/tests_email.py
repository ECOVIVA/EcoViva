from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.core import mail
from apps.users.models import Users
from apps.users.tests import UsersMixin
from apps.users.email.tokens import email_confirmation_token
from datetime import timedelta


class EmailConfirmTest(APITestCase, UsersMixin):
    def setUp(self):
        self.user_data = {
            'email': 'testuser@example.com',
            'username': 'testuser',
            'password': 'testpassword123'
        }
        self.user = Users.objects.create_user(**self.user_data)  # Certifique-se de usar o método correto para criar o usuário com senha
        self.user.is_active = False  # Defina o usuário como inativo para teste de confirmação de email
        self.user.save()

    def test_email_auth_success(self):
        # Autenticar o usuário
        self.client.force_authenticate(user=self.user)
        
        # Gerar o uidb64 e o token para o usuário
        uidb64 = urlsafe_base64_encode(force_bytes(self.user.pk))
        token = email_confirmation_token.make_token(self.user)

        # Criar a URL de confirmação de email
        url = reverse('confirm_email', args=[uidb64, token])

        response = self.client.get(url)
        
        # Atualizar o objeto do usuário no banco de dados
        self.user.refresh_from_db()

        # Verificar se o status da resposta é OK e se o usuário foi ativado
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(self.user.is_active, True)

    def test_email_auth_fail_for_auth(self):
        invalid_token = email_confirmation_token.make_token(self.user)
        invalid_uidb64 = urlsafe_base64_encode(force_bytes(9999))  # ID que não existe

        # Criar a URL com o uidb64 inválido
        url = reverse('confirm_email', args=[invalid_uidb64, invalid_token])

        # Fazer a requisição GET para tentar confirmar o email
        response = self.client.get(url)
        
        # Atualizar o objeto do usuário no banco de dados
        self.user.refresh_from_db()

        # Verificar se o status da resposta é Bad Request (400) devido ao token inválido
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        # Verificar se nenhum e-mail foi enviado ao tentar confirmar com dados inválidos
        self.assertEqual(len(mail.outbox), 0)

    def test_email_auth_fail_for_active_user(self):
        # Definir o usuário como já ativo
        self.user.is_active = True
        self.user.save()

        uidb64 = urlsafe_base64_encode(force_bytes(self.user.pk))
        token = email_confirmation_token.make_token(self.user)

        url = reverse('confirm_email', args=[uidb64, token])
        
        response = self.client.get(url)

        # Verificar se a resposta foi Bad Request, pois o usuário já está ativo
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual({'detail': 'O usuário já tem o e-mail autenticado.'} , response.json())

    def test_resend_email_confirmation(self):
        # Verificar se o e-mail de confirmação pode ser reenviado
        url = reverse('resend_email')
        response = self.client.post(url, {'email': self.user.email})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('E-mail de confirmação reenviado', str(response.data))

    def test_resend_email_confirmation_with_invalid_email(self):
        # Tentar reenviar com e-mail inválido
        url = reverse('resend_email')
        response = self.client.post(url, {'email': 'invalid@example.com'})
        
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual({'error': 'E-mail não encontrado.'}, response.json())

    def test_login_after_email_confirmation(self):
        # Confirmar e-mail
        uidb64 = urlsafe_base64_encode(force_bytes(self.user.pk))
        token = email_confirmation_token.make_token(self.user)
        
        url = reverse('confirm_email', args=[uidb64, token])

        
        # Confirmar o e-mail
        self.client.get(url)
        
        # Verificar se o login funciona após a confirmação
        response = self.client.post(reverse('login'), {
            'email': self.user.email,
            'password': self.user_data['password']
        })
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
