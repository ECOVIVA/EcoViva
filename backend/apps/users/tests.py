from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.core.files.uploadedfile import SimpleUploadedFile
from io import BytesIO
from PIL import Image

from utils.usermixin import UsersMixin
from apps.users import models

# Testes da View 'UsersCreateView', que cria novos usuários
class UsersTest(APITestCase, UsersMixin):
    def setUp(self):
        self.user = self.make_user()
        self.user2 = self.make_user_not_autenticated()

    def test_get_user_profile(self):
        url = reverse('users:user_profile')

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json().get('username'), 'username')

    def test_get_user_profile_fail_for_unauthorized(self):
        url = reverse('users:user_profile')

        self.client.logout()

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response.json().get('detail'), 'As credenciais de autenticação não foram fornecidas.')

    # Testando o método POST para criação de usuário sem foto
    def test_post_user_create(self):
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

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.json().get('detail'), 'Usuário criado com sucesso!')

    # Testando o método POST para criação de usuário sem foto
    def test_post_user_create_with_interests(self):
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
        self.assertEqual(response.json().get('detail'), 'Usuário criado com sucesso!')


    # Testando o método POST para criação de usuário com foto
    def test_post_user_create_with_photo(self):
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
    def test_post_user_create_fail_for_phone(self):
        api_url = reverse('users:user_create')

        # Dados inválidos (faltando email e senha)
        invalid_data = {
            "first_name": "Erro",
            "last_name": "Teste",
            "username": "usuariocomerro",
            "password": "SenhaErrada321",
            "email": "usererrro@email.com",
            "phone": "abc123" 
        }

        response = self.client.post(api_url, data=invalid_data, format='json')

        # Verifica se a resposta é um erro (status 400)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.json().get('phone')[0], 'Número de telefone inválido. O formato correto é (XX) XXXXX-XXXX ou 119XXXXXXXX.')

    # Testando o método POST com email e senha inválidos
    def test_post_user_create_fail_for_password_and_email(self):
        api_url = reverse('users:user_create')

        invalid_data = {
            "first_name": "Erro",
            "last_name": "Teste",
            "username": "usuariocomerro",
            "email": "emailcomerro",
            "password": "123",
            "phone": "11123456789"
        }

        response = self.client.post(api_url, data=invalid_data, format='json')

        # Verifica se a resposta é um erro (status 400)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.json().get('email')[0], 'Insira um endereço de email válido.')
        self.assertEqual(response.json().get("password")[0], 'Esta senha é muito curta. Ela precisa conter pelo menos 8 caracteres.')
        self.assertEqual(response.json().get("password")[1], 'Esta senha é muito comum.')
        self.assertEqual(response.json().get("password")[2], 'Esta senha é inteiramente numérica.')

    # Testando o método POST com tipo de imagem inválido
    def test_post_user_create_fail_for_photo_invalid_for_type(self):
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
        self.assertEqual(response.json().get('photo')[0], "A extensão de arquivo “gif” não é permitida. As extensões válidas são: jpg, jpeg, png .")

    # Testando o PATCH para atualização de dados do usuário
    def test_patch_user_update(self):
        api_url = reverse('users:user_update')

        payload = {
            "username": "newuser",
            "phone": '12345678910'
        }

        response = self.client.patch(api_url, payload)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json(), 'Dados atualizados com sucesso!!')

    def test_patch_user_update_with_interest(self):
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
    def test_patch_user_update_fail_for_username_duplicate(self):
        api_url = reverse('users:user_update')

        payload = {
            "username": 'username2',  
        }

        response = self.client.patch(api_url, payload)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.json().get('username')[0], 'Um usuário com este nome de usuário já existe.')

    def test_patch_user_update_fail_for_unauthorized(self):
        api_url = reverse('users:user_update')

        self.client.logout()

        payload = {
            "username": "newuser",
            "phone": '12345678910'
        }

        response = self.client.patch(api_url, payload)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response.json().get('detail'), 'As credenciais de autenticação não foram fornecidas.')

    def test_delete_user_delete(self):
        api_url = reverse('users:user_delete')

        response = self.client.delete(api_url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_delete_user_delete_fail_for_unauthorized(self):
        api_url = reverse('users:user_delete')

        self.client.logout()

        response = self.client.delete(api_url)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response.json().get('detail'), 'As credenciais de autenticação não foram fornecidas.')