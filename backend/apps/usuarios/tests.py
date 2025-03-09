from django.urls import reverse
from rest_framework.test import APITestCase
from django.core.files.uploadedfile import SimpleUploadedFile
from io import BytesIO
from PIL import Image

from apps.usuarios import models

# Create your tests here.

class UsersTest(APITestCase ):
    def test_users_api_list_return_code_200(self):
        api_url = reverse('users:user_list')
        response = self.client.get(api_url)

        self.assertIn(
            response.status_code,
            [200, 204]
        )

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

    def test_users_api_create_with_password_and_email_invalid(self):
        api_url = reverse('users:user_list')

        # Dados inválidos (faltando email e senha)
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