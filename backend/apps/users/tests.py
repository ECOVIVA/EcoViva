from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.core.files.uploadedfile import SimpleUploadedFile
from io import BytesIO
from PIL import Image

from apps.users import models

# Mixin para facilitar a criação de usuários nos testes
class UsersMixin:
    def make_user(
        self,
        first_name='user',
        last_name='name',
        username='username',
        password='SenhaMuitoSegura123',
        email='username@email.com',
        phone='(11) 11111-1111',
        photo=None,
    ):
        # Cria um usuário no banco de dados e faz autenticação automática
        user = models.Users.objects.create_user(
            first_name=first_name,
            last_name=last_name,
            username=username,
            password=password,
            email=email,
            phone=phone,
            is_active = True

        )

        # Autentica o usuário (corrigido para o método correto)
        self.client.force_authenticate(user)

        return user
    
    def make_user_for_comparison(
        self,
        first_name='user2',
        last_name='name2',
        username='username2',
        password='SenhaMuitoSegura321',
        email='username2@email.com',
        phone='(22) 22222-2222',
        photo=None
    ):
        # Cria um usuário para comparação
        user = models.Users.objects.create_user(
            first_name=first_name,
            last_name=last_name,
            username=username,
            password=password,
            email=email,
            phone=phone,
            is_active = True
        )
    
        # Autentica o usuário criado
        self.client.force_authenticate(user)

        return user
    
    def make_user_not_autenticated(
        self,
        first_name='user2',
        last_name='name2',
        username='username2',
        password='SenhaMuitoSegura321',
        email='username2@email.com',
        phone='(22) 22222-2222',
        photo=None
    ):
        # Cria um usuário para comparação
        user = models.Users.objects.create_user(
            first_name=first_name,
            last_name=last_name,
            username=username,
            password=password,
            email=email,
            phone=phone,
            is_active = True
        )

        return user

# Testes da View 'UsersCreateView', que cria novos usuários
class UsersTest(APITestCase, UsersMixin):
    def setUp(self):
        self.user = self.make_user_not_autenticated()

    # Testando o método POST para criação de usuário sem foto
    def test_users_api_create(self):
        api_url = reverse('users:user_create')

        # Dados válidos para criação de um usuário
        valid_data = {
            "first_name": "Novo",
            "last_name": "Usuário",
            "username": "novouser",
            "password": "SenhaCorreta321",
            "email": "novouser@email.com",
            "phone": "11987654321"
        }

        response = self.client.post(api_url, data=valid_data, format='json')
        # Verifica se a resposta foi criada com sucesso (status 201)
        self.assertEqual(response.status_code, 201)

        self.assertEqual(models.Users.objects.filter(username = "novouser").exists(), True)

    # Testando o método POST para criação de usuário sem foto
    def test_users_api_create_with_interests(self):
        api_url = reverse('users:user_create')

        # Dados válidos para criação de um usuário
        valid_data = {
            "first_name": "Novo",
            "last_name": "Usuário",
            "username": "novouser",
            "password": "SenhaCorreta321",
            "email": "novouser@email.com",
            "phone": "11987654321",
            'interests': ['Reciclagem']
        }

        response = self.client.post(api_url, data=valid_data, format='json')

        # Verifica se a resposta foi criada com sucesso (status 201)
        self.assertEqual(response.status_code, 201)
        user = models.Users.objects.filter(username = "novouser").first()
        interest = user.interests.all()[0]
        self.assertEqual(interest.name, 'Reciclagem')

    # Testando o método POST para criação de usuário com foto
    def test_users_api_create_with_photo(self):
        api_url = reverse('users:user_create')

        # Criando uma imagem de teste
        image = Image.new('RGB', (100, 100), color='red')
        image_file = BytesIO()
        image.save(image_file, format='JPEG')
        image_file.name = 'test_photo.jpg'
        image_file.seek(0) 

        # Criando um arquivo de imagem para upload
        photo = SimpleUploadedFile(image_file.name, image_file.read(), content_type="image/jpeg")

        # Dados válidos para criação de usuário, com foto
        valid_data = {
            "first_name": "Novo",
            "last_name": "Usuário",
            "username": "novouser",
            "password": "SenhaCorreta321",
            "email": "novouser@email.com",
            "phone": "11987654321",
            "photo": photo
        }

        response = self.client.post(api_url, data=valid_data, format='multipart')

        # Verifica se o usuário foi criado com sucesso e a foto foi salva
        self.assertEqual(response.status_code, 201)
        user_profile = models.Users.objects.get(username=valid_data.get("username"))
        self.assertTrue(user_profile.photo.name.startswith('users_photos/test_photo.jpg'))

        # Limpa o arquivo após o teste
        user_profile.photo.delete()

    # Testando o método POST para criação de usuário com dados inválidos (faltando email e senha)
    def test_users_api_create_invalid(self):
        api_url = reverse('users:user_create')

        # Dados inválidos (faltando email e senha)
        invalid_data = {
            "first_name": "Erro",
            "last_name": "Teste",
            "username": "usuariocomerro",
            "phone": "abc123"  # Telefone inválido
        }

        response = self.client.post(api_url, data=invalid_data, format='json')

        # Verifica se a resposta é um erro (status 400)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("email", response.data)
        self.assertIn("password", response.data)
        self.assertIn("phone", response.data)

    # Testando o método POST com email e senha inválidos
    def test_users_api_create_with_password_and_email_invalid(self):
        api_url = reverse('users:user_create')

        invalid_data = {
            "first_name": "Erro",
            "last_name": "Teste",
            "username": "usuariocomerro",
            "email": "emailcomerro",
            "password": "12345",
            "phone": "abc123"  # Telefone inválido
        }

        response = self.client.post(api_url, data=invalid_data, format='json')

        # Verifica se a resposta é um erro (status 400)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("email", response.data)
        self.assertIn("password", response.data)
        self.assertIn("phone", response.data)

    # Testando o método POST com tipo de imagem inválido
    def test_users_api_create_with_photo_invalid_for_type(self):
        api_url = reverse('users:user_create')

        image = Image.new('RGB', (100, 100), color='red')
        image_file = BytesIO()
        image.save(image_file, format='GIF')  # Formato inválido
        image_file.name = 'test_photo.gif'
        image_file.seek(0)

        photo = SimpleUploadedFile(image_file.name, image_file.read(), content_type="image/gif")

        # Dados válidos para criação de usuário, com foto
        valid_data = {
            "first_name": "Novo",
            "last_name": "Usuário",
            "username": "novouser",
            "password": "SenhaCorreta321",
            "email": "novouser@email.com",
            "phone": "11987654321",
            "photo": photo
        }

        response = self.client.post(api_url, data=valid_data, format='multipart')

        # Verifica se a resposta é um erro de tipo de imagem (status 400)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("photo", response.data)

    # Testando o método POST com tamanho de imagem inválido
    def test_users_api_create_with_photo_invalid_for_size(self):
        api_url = reverse('users:user_create')

        image = Image.new('RGB', (2000, 2000), color='red')  # Imagem muito grande
        image_file = BytesIO()
        image.save(image_file, format='PNG')
        image_file.name = 'test_photo.png'
        image_file.seek(0)

        photo = SimpleUploadedFile(image_file.name, image_file.read(), content_type="image/png")

        # Dados válidos para criação de usuário, com foto
        valid_data = {
            "first_name": "Novo",
            "last_name": "Usuário",
            "username": "novouser",
            "password": "SenhaCorreta321",
            "email": "novouser@email.com",
            "phone": "11987654321",
            "photo": photo
        }

        response = self.client.post(api_url, data=valid_data, format='multipart')

        # Verifica se a resposta é um erro de tamanho de imagem (status 400)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("photo", response.data)

    # Testando o PATCH para atualização de dados do usuário
    def test_users_api_object_update(self):
        self.make_user(username='user')
        api_url = reverse('users:user_update')

        payload = {
            "username": "newuser",
            "phone": '12345678910'
        }

        response = self.client.patch(api_url, payload)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_users_api_object_update_with_interest(self):
        self.make_user(username='user')
        api_url = reverse('users:user_update')

        payload = {
            "username": "newuser",
            "phone": '12345678910',
            'interests': ['Reciclagem']
        }

        response = self.client.patch(api_url, payload)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        user = models.Users.objects.filter(username = "newuser").first()
        interest = user.interests.all()[0]
        self.assertEqual(interest.name, 'Reciclagem')

    # Testando o PATCH para atualização com nome de usuário duplicado
    def test_users_api_object_update_username_invalid_duplicate(self):
        api_url = reverse('users:user_update')
        self.user = self.make_user(username='usuario1', email='usuario1@email.com')
        self.user2 = self.make_user_not_autenticated(username='usuario2', email='usuario2@email.com')

        payload = {
            "username": 'usuario2',  
        }

        response = self.client.patch(api_url, payload)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('username', response.data)

    def test_users_api_object_update_fail_for_unauthorized(self):
        api_url = reverse('users:user_update')

        payload = {
            "username": "newuser",
            "phone": '12345678910'
        }

        response = self.client.patch(api_url, payload)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_users_api_object_delete(self):
        self.user = self.make_user()
        api_url = reverse('users:user_delete')

        response = self.client.delete(api_url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_users_api_object_delete_fail_autenticated(self):
        api_url = reverse('users:user_delete')

        response = self.client.delete(api_url)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
