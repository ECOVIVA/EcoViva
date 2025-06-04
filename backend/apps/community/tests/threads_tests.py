from django.urls import reverse
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework import status
from rest_framework.test import APITestCase
from io import BytesIO
from PIL import Image
from apps.community.models.threads import Thread
from apps.community.models.community import Community
from apps.users.tests import UsersMixin

class ThreadTests(APITestCase, UsersMixin):
    def setUp(self):
        self.user = self.make_user()
        self.user2 = self.make_user_not_autenticated()
        
        self.community = Community.objects.create(
            name="Nome da Comunidade",
            description="Esta é uma descrição da comunidade.",
            owner=self.user,
            is_private=True  # ou False, conforme desejado
        )
        
        # Criação de uma thread para os testes
        self.thread_data = {
            'community': self.community,
            'title': 'Test Thread',
            'content': 'Test content for thread',
            'author': self.user,
        }

        self.thread = Thread.objects.create(**self.thread_data)

    def test_get_thread_list(self):
        url = reverse('community:list_thread', args=[self.community.slug])

        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_thread_list_fail_for_403(self):
        url = reverse('community:list_thread', args=[self.community.slug])

        self.client.logout()
        self.client.force_authenticate(self.user2)

        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual('Somente membro da comunidade pode realizar essa ação.', response.json().get('detail'))

    def test_post_thread_create(self):
        url = reverse('community:create_thread', args=[self.community.slug])

        data = {
            'title': 'New Thread',
            'content': 'Content for new thread',
            'author': self.user.id,
        }

        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.json().get('detail'), 'Thread criada com sucesso!')

    def test_post_thread_create_with_tags(self):
        url = reverse('community:create_thread', args=[self.community.slug])
        data = {
            'title': 'New Thread',
            'content': 'Content for new thread',
            'author': self.user.id,
            'tags': ['Django', 'Python', 'API']
        }

        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.json().get('detail'), 'Thread criada com sucesso!')

    def test_post_thread_create_with_cover(self):
        url = reverse('community:create_thread', kwargs={'slug': self.community.slug})

        image = Image.new('RGB', (1500, 1500), color='red')
        image_file = BytesIO()
        image.save(image_file, format='JPEG')
        image_file.name = 'test_cover.jpg'
        image_file.seek(0) 

        cover = SimpleUploadedFile(image_file.name, image_file.read(), content_type="image/jpeg")

        data = {
            'community': self.community.pk,
            'title': 'New Thread',
            'content': 'Content for new thread',
            'cover': cover
        }

        response = self.client.post(url, data, format='multipart')

        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        thread = Thread.objects.get(title = data['title'])
        image_path = thread.cover.path
        with Image.open(image_path) as img:
            width, height = img.size

        self.assertLessEqual(width, 800)
        self.assertLessEqual(height, 600)

        thread.cover.delete()

    def test_post_thread_create_fail_for_403(self):
        url = reverse('community:create_thread', args=[self.community.slug])

        self.client.logout()
        self.client.force_authenticate(self.user2)

        data = {
            'title': 'New Thread',
            'content': 'Content for new thread',
            'author': self.user.id,
        }

        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual('Somente membro da comunidade pode realizar essa ação.', response.json().get('detail'))
    
    def test_post_thread_create_fail_for_unauthorized(self):
        url = reverse('community:create_thread', kwargs={'slug': self.community.slug})

        self.client.logout()

        data = {
            'community': self.community.pk,
            'title': '',
            'content': 'Content for new thread',
            'author': self.user.id
        }

        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response.json().get('detail'), 'As credenciais de autenticação não foram fornecidas.')

    def test_post_thread_create_fail_for_blank(self):
        url = reverse('community:create_thread', kwargs={'slug': self.community.slug})

        data = {
            'community': self.community.pk,
            'title': '',
            'content': 'Content for new thread',
        }

        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.json().get('title')[0], 'Este campo não pode ser em branco.')


    def test_post_thread_create_fail_for_lenght_255(self):
        url = reverse('community:create_thread', kwargs={'slug': self.community.slug})

        title_255 = 'a'*256

        data = {
            'community': self.community.pk,
            'title': title_255,
            'content': 'Content for new thread',
            'author': self.user.id
        }
        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.json().get('title')[0], 'Certifique-se de que este campo não tenha mais de 255 caracteres.')

    def test_post_thread_create_fail_for_invalid_tags(self):
        """Testa a falha ao criar uma thread com tags em formato inválido"""
        url = reverse('community:create_thread', kwargs={'slug': self.community.slug})

        data = {
            'community': self.community.pk,
            'title': 'Thread com tags inválidas',
            'content': 'Content for new thread',
            'author': self.user.id,
            'tags': 'django, python'
        }
        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.json().get('tags')[0], 'Necessário uma lista de itens, mas recebeu tipo "str".')

    def test_post_thread_create_fail_for_cover_type(self):
        url = reverse('community:create_thread', kwargs={'slug': self.community.slug})

        image = Image.new('RGB', (100, 100), color='red')
        image_file = BytesIO()
        image.save(image_file, format='GIF')
        image_file.name = 'test_cover.gif'
        image_file.seek(0) 

        cover = SimpleUploadedFile(image_file.name, image_file.read(), content_type="image/gif")

        data = {
            'community': self.community.pk,
            'title': 'New Thread',
            'content': 'Content for new thread',
            'author': self.user.id,
            'cover': cover
        }

        response = self.client.post(url, data, format='multipart')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.json().get('cover')[0], 'A extensão de arquivo “gif” não é permitida. As extensões válidas são: jpg, jpeg, png .')

    def test_patch_thread_update(self):
        url = reverse('community:update_thread', args=[self.community.slug, self.thread.slug])

        data = {
            'title': 'New_Title',
            'tags': ['Updated', 'Thread', 'Test']
        }

        response = self.client.patch(url, data, format='json')

        self.thread.refresh_from_db()

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json().get('detail'),  'Thread atualizada com sucesso!')

    def test_patch_thread_update_with_cover(self):
        url = reverse('community:update_thread', args=[self.community.slug ,self.thread.slug])

        image = Image.new('RGB', (1500, 1500), color='red')
        image_file = BytesIO()
        image.save(image_file, format='JPEG')
        image_file.name = 'test_cover.jpg'
        image_file.seek(0) 

        cover = SimpleUploadedFile(image_file.name, image_file.read(), content_type="image/jpeg")

        data = {
            'title': 'New_Title',
            'tags': ['Updated', 'Thread', 'Test'],
            'cover': cover
        }

        response = self.client.patch(url, data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        thread = Thread.objects.get(title = data['title'])
        image_path = thread.cover.path
        with Image.open(image_path) as img:
            width, height = img.size

        self.assertLessEqual(width, 800)
        self.assertLessEqual(height, 600)

        self.assertEqual(response.json().get('detail'),  'Thread atualizada com sucesso!')

        thread.cover.delete()

    def test_patch_thread_update_fail_for_404(self):
        url = reverse('community:update_thread', args=[self.community.slug, 999])

        data = {
            'title': 'Error_Test',
        }

        response = self.client.patch(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.json().get('detail'), 'Thread não encontrada!')

    def test_patch_thread_update_fail_for_invalid_tags(self):
        """Testa a falha ao atualizar uma thread com tags inválidas"""
        url = reverse('community:update_thread', args=[self.community.slug, self.thread.slug])

        data = {
            'tags': 'invalid_format' 
        }

        response = self.client.patch(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.json().get('tags')[0], 'Necessário uma lista de itens, mas recebeu tipo "str".')

    def test_patch_thread_update_fail_for_unauthorized(self):
        url = reverse('community:update_thread', args=[self.community.slug, self.thread.slug])

        self.client.logout()

        data = {
            'title': 'New_Title',
            'tags': ['Updated', 'Thread', 'Test']
        }

        response = self.client.patch(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_patch_thread_update_fail_for_not_owner(self):
        url = reverse('community:update_thread', args=[self.community.slug, self.thread.slug])

        self.client.logout()
        self.client.force_authenticate(self.user2)

        data = {
            'title': 'New_Title',
            'tags': ['Updated', 'Thread', 'Test']
        }

        response = self.client.patch(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(response.json(), {'detail': 'Você não tem permissão para fazer essa ação no post'})

    def test_get_thread_detail(self):
        url = reverse('community:detail_thread', args=[self.community.slug, self.thread.slug])

        response = self.client.get(url) 

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json().get('slug'), self.thread.slug)

    def test_get_thread_detail_fail_for_403(self):
        url = reverse('community:detail_thread', args=[self.community.slug, self.thread.slug])

        self.client.logout()
        self.client.force_authenticate(self.user2)

        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual('Somente membro da comunidade pode realizar essa ação.', response.json().get('detail'))

    def test_delete_thread_delete(self):
        url = reverse('community:delete_thread', args=[self.community.slug, self.thread.slug])

        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_delete_thread_delete_fail_for_not_found(self):
        url = reverse('community:delete_thread', args=[self.community.slug, 'asasas'])

        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_delete_thread_delete_fail_unauthorized(self):
        url = reverse('community:delete_thread', args=[self.community.slug, self.thread.slug])

        self.client.logout()
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_delete_thread_delete_fail_for_not_owner(self):
        url = reverse('community:delete_thread', args=[self.community.slug, self.thread.slug])
        self.client.logout()
        self.client.force_authenticate(self.user2)

        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(response.json(), {'detail': 'Você não tem permissão para fazer essa ação no post'})
