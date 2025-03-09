from django.urls import reverse
from rest_framework.test import APITestCase
from django.core.files.uploadedfile import SimpleUploadedFile
from io import BytesIO
from PIL import Image

from apps.usuarios import models

class UsersMixin:
    def make_user(
        self,
        first_name='user',
        last_name='name',
        username='username',
        password='SenhaMuitoSegura123',
        email='username@email.com',
        phone = '(11) 11111-1111',
        photo = None
    ):
        return models.Users.objects.create_user(
            first_name=first_name,
            last_name=last_name,
            username=username,
            password=password,
            email=email,
            phone=phone
        )
    
    def make_user_for_comparison(
        self,
        first_name='user2',
        last_name='name2',
        username='username2',
        password='SenhaMuitoSegura321',
        email='username2@email.com',
        phone = '(22) 22222-2222',
        photo = None
    ):
        return models.Users.objects.create_user(
            first_name=first_name,
            last_name=last_name,
            username=username,
            password=password,
            email=email,
            phone=phone
        )


class UsersTest(APITestCase, UsersMixin ):

    # Tests de UsersView

    # Testando o Metodo GET
    def test_users_api_list_return_success(self):
        api_url = reverse('users:user_list')
        response = self.client.get(api_url)

        self.assertIn(
            response.status_code,
            [200, 204]
        )

    # Testando o Metodo Post, caso de sucesso sem foto
    def test_users_api_create(self):
        api_url = reverse('users:user_list')

        # Dados válidos para criação de usuário
        valid_data = {
            "first_name": "Novo",
            "last_name": "Usuário",
            "username": "novouser",
            "password": "SenhaCorreta321",
            "email": "novouser@email.com",
            "phone": "11987654321"
        }

        response = self.client.post(api_url, data=valid_data, format='json')

        self.assertEqual(response.status_code, 201)
        self.assertEqual(models.Users.objects.count(), 1)
        self.assertEqual(models.Users.objects.first().username, "novouser")

    # Testando o Metodo Post, caso de sucesso com foto
    def test_users_api_create_with_photo(self):
        api_url = reverse('users:user_list')

        image = Image.new('RGB', (100, 100), color='red')
        image_file = BytesIO()
        image.save(image_file, format='JPEG')
        image_file.name = 'test_photo.jpg'
        image_file.seek(0) 

        photo = SimpleUploadedFile(image_file.name, image_file.read(), content_type="image/jpeg")


        # Dados válidos para criação de usuário, com uma foto
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

        self.assertEqual(response.status_code, 201)
        user_profile = models.Users.objects.get(username = valid_data.get("username"))
        self.assertTrue(user_profile.photo.name.startswith('users_photos/test_photo.jpg'))

        user_profile.photo.delete()

    # Testando o Metodo Post, caso de falha, pelo fato dos campos email e password estarem ausentes
    def test_users_api_create_invalid(self):
        api_url = reverse('users:user_list')

        # Dados inválidos (faltando email e senha)
        invalid_data = {
            "first_name": "Erro",
            "last_name": "Teste",
            "username": "usuariocomerro",
            "phone": "abc123" # Telefone Inválido
        }

        response = self.client.post(api_url, data=invalid_data, format='json')

        self.assertEqual(response.status_code, 400)
        self.assertIn("email", response.data)
        self.assertIn("password", response.data)
        self.assertIn("phone", response.data)

    # Testando o Metodo Post, caso de falha, pelo fato dos campos email, password e phone estarem Invalidos
    def test_users_api_create_with_password_and_email_invalid(self):
        api_url = reverse('users:user_list')

        invalid_data = {
            "first_name": "Erro",
            "last_name": "Teste",
            "username": "usuariocomerro",
            "email": "emailcomerro",
            "password" : "12345",
            "phone": "abc123" # Telefone Inválido
        }

        response = self.client.post(api_url, data=invalid_data, format='json')

        self.assertEqual(response.status_code, 400)
        self.assertIn("email", response.data)
        self.assertIn("password", response.data)
        self.assertIn("phone", response.data)

    # Testando o Metodo Post, caso de falha, pelo fato do tipo de imagem ser incompativel em validação
    def test_users_api_create_with_photo_invalid_for_type(self):
        api_url = reverse('users:user_list')

        image = Image.new('RGB', (100, 100), color='red')
        image_file = BytesIO()
        image.save(image_file, format='GIF')
        image_file.name = 'test_photo.gif'
        image_file.seek(0) 

        photo = SimpleUploadedFile(image_file.name, image_file.read(), content_type="image/gif")


        # Dados válidos para criação de usuário, com uma foto
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

        self.assertEqual(response.status_code, 400)
        self.assertIn("photo", response.data)


    # Testando o Metodo Post, caso de falha, pelo fato do tamanho da imagem ser maior que a aceita em validação
    def test_users_api_create_with_photo_invalid_for_size(self):
        api_url = reverse('users:user_list')

        image = Image.new('RGB', (2000, 2000), color='red')
        image_file = BytesIO()
        image.save(image_file, format='PNG')
        image_file.name = 'test_photo.png'
        image_file.seek(0) 

        photo = SimpleUploadedFile(image_file.name, image_file.read(), content_type="image/png")


        # Dados válidos para criação de usuário, com uma foto
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

        self.assertEqual(response.status_code, 400)
        self.assertIn("photo", response.data)

    # Tests de UsersDetailView

    # Testando a API em caso de GET, caso de sucesso
    def test_users_api_object_return_code_200(self):
        self.make_user(username='user')
        api_url = reverse('users:user_detail', args=['user'])
        
        response = self.client.get(api_url)

        self.assertEqual(
            response.status_code,
            200
        )

    # Testando a API em caso de GET, caso de falha, por não existir usuario
    def test_users_api_object_return_code_404(self):
        self.make_user(username='user')
        api_url = reverse('users:user_detail', args=['user_not_found'])
        
        response = self.client.get(api_url)

        self.assertEqual(
            response.status_code,
            404
        )


    # Testando a api em caso de Update, caso de sucesso
    def test_users_api_object_update(self):
        self.make_user(username='user')
        api_url = reverse('users:user_detail', args=['user'])
        
        payload = {
            "username": "newuser",
            "phone": '12345678910'
        }

        response = self.client.patch(api_url, payload)

        self.assertEqual(
            response.status_code,
            200
        )

    # Testando a api em caso de Update, caso de falha, por motivos de duplicação de dados que deveriam ser unicos
    def test_users_api_object_update_username_invalid_duplicate(self):
        self.make_user(username='user')
        self.make_user_for_comparison(username='user2')
        api_url = reverse('users:user_detail', args=['user'])
        
        payload = {
            "username": 'user2',
            "email": "(22) 22222-2222"
        }

        response = self.client.patch(api_url, payload)

        self.assertEqual(
            response.status_code,
            400
        )
        self.assertIn('username', response.data)

    # Testando a api em caso de Delete
    def test_users_api_object_delete(self):
        self.make_user(username='user')
        api_url = reverse('users:user_detail', args=['user'])
        
        response = self.client.delete(api_url)

        self.assertEqual(
            response.status_code,
            204
        )