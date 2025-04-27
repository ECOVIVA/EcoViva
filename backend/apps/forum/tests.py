import os
from rest_framework import status
from rest_framework.test import APITestCase
from django.urls import reverse
from django.utils.text import slugify

from django.core.files.uploadedfile import SimpleUploadedFile
from io import BytesIO
from PIL import Image

from apps.forum.models import Thread, Post
from apps.users.tests import UsersMixin

class ThreadTests(APITestCase,UsersMixin ):
    def setUp(self):
        # Criação de um usuário para os testes
        self.user = self.make_user()
        self.user2 = self.make_user_not_autenticated()
        
        self.cover_image = SimpleUploadedFile(
        name='test_cover.jpg',
        content=b'\x47\x49\x46\x38\x89\x61',  # Dados binários simulando um JPEG/GIF
        content_type='image/jpeg'
    )
        
        # Criação de uma thread para os testes
        self.thread_data = {
            'title': 'Test Thread',
            'content': 'Test content for thread',
            'author': self.user,
            'cover': self.cover_image
        }

        self.thread = Thread.objects.create(**self.thread_data)

    def test_get_thread_list(self):
        url = reverse('forum:list_thread')

        response = self.client.get(url)
        print(response.json())


        self.assertEqual(response.status_code, status.HTTP_200_OK)


    def test_post_thread_create(self):
        url = reverse('forum:create_thread')
        data = {
            'title': 'New Thread',
            'content': 'Content for new thread',
            'author': self.user.id,
        }

        response = self.client.post(url, data, format='json')
        print(response.json())

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.json().get('detail'), 'Thread criada com sucesso!')

    def test_post_thread_create_with_tags(self):
        url = reverse('forum:create_thread')
        data = {
            'title': 'New Thread',
            'content': 'Content for new thread',
            'author': self.user.id,
            'tags': ['Django', 'Python', 'API']
        }

        response = self.client.post(url, data, format='json')

        print(response.json())

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.json().get('detail'), 'Thread criada com sucesso!')

    def test_post_thread_create_with_cover(self):
        url = reverse('forum:create_thread')

        image = Image.new('RGB', (100, 100), color='red')
        image_file = BytesIO()
        image.save(image_file, format='JPEG')
        image_file.name = 'test_cover.jpg'
        image_file.seek(0) 

        cover = SimpleUploadedFile(image_file.name, image_file.read(), content_type="image/jpeg")

        data = {
            'title': 'New Thread',
            'content': 'Content for new thread',
            'cover': cover
        }

        response = self.client.post(url, data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        thread = Thread.objects.get(title = data['title'])

        thread.cover.delete()        
    
    def test_post_thread_create_fail_for_unauthorized(self):
        url = reverse('forum:create_thread')

        self.client.logout()

        data = {
            'title': '',
            'content': 'Content for new thread',
            'author': self.user.id
        }

        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response.json().get('detail'), 'As credenciais de autenticação não foram fornecidas.')

    def test_post_thread_create_fail_for_blank(self):
        url = reverse('forum:create_thread')

        data = {
            'title': '',
            'content': 'Content for new thread',
        }

        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.json().get('title')[0], 'Este campo não pode ser em branco.')


    def test_post_thread_create_fail_for_lenght_255(self):
        url = reverse('forum:create_thread')

        title_255 = 'a'*256

        data = {
            'title': title_255,
            'content': 'Content for new thread',
            'author': self.user.id
        }
        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.json().get('title')[0], 'Certifique-se de que este campo não tenha mais de 255 caracteres.')

    def test_post_thread_create_fail_for_invalid_tags(self):
        """Testa a falha ao criar uma thread com tags em formato inválido"""
        url = reverse('forum:create_thread')

        data = {
            'title': 'Thread com tags inválidas',
            'content': 'Content for new thread',
            'author': self.user.id,
            'tags': 'django, python'
        }
        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.json().get('tags')[0], 'Necessário uma lista de itens, mas recebeu tipo "str".')

    def test_post_thread_create_fail_for_cover_type(self):
        url = reverse('forum:create_thread')

        image = Image.new('RGB', (100, 100), color='red')
        image_file = BytesIO()
        image.save(image_file, format='GIF')
        image_file.name = 'test_cover.gif'
        image_file.seek(0) 

        cover = SimpleUploadedFile(image_file.name, image_file.read(), content_type="image/gif")

        data = {
            'title': 'New Thread',
            'content': 'Content for new thread',
            'author': self.user.id,
            'cover': cover
        }

        response = self.client.post(url, data, format='multipart')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.json().get('cover')[0], 'A extensão de arquivo “gif” não é permitida. As extensões válidas são: jpg, jpeg, png .')

    def test_patch_thread_update(self):
        url = reverse('forum:update_thread', args=[self.thread.slug])

        data = {
            'title': 'New_Title',
            'tags': ['Updated', 'Thread', 'Test']
        }

        response = self.client.patch(url, data, format='json')

        self.thread.refresh_from_db()

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json().get('detail'),  'Thread atualizada com sucesso!')

    def test_patch_thread_update_with_cover(self):
        url = reverse('forum:update_thread', args=[self.thread.slug])

        old_cover_path = self.thread.cover.path
        self.assertTrue(os.path.exists(old_cover_path))

        data = {
            'title': 'New_Title',
            'tags': ['Updated', 'Thread', 'Test'],
            'cover': None
        }

        response = self.client.patch(url, data, format='json')

        self.thread.refresh_from_db()

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json().get('detail'),  'Thread atualizada com sucesso!')

        self.assertFalse(self.thread.cover)
        self.assertFalse(os.path.exists(old_cover_path))

    def test_patch_thread_update_fail_for_404(self):
        url = reverse('forum:update_thread', args=[999])

        data = {
            'title': 'Error_Test',
        }

        response = self.client.patch(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.json().get('detail'), 'Thread não encontrada!')

    def test_patch_thread_update_fail_for_invalid_tags(self):
        """Testa a falha ao atualizar uma thread com tags inválidas"""
        url = reverse('forum:update_thread', args=[self.thread.slug])

        data = {
            'tags': 'invalid_format' 
        }

        response = self.client.patch(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.json().get('tags')[0], 'Necessário uma lista de itens, mas recebeu tipo "str".')

    def test_patch_thread_update_fail_for_unauthorized(self):
        url = reverse('forum:update_thread', args=[self.thread.slug])

        self.client.logout()

        data = {
            'title': 'New_Title',
            'tags': ['Updated', 'Thread', 'Test']
        }

        response = self.client.patch(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_patch_thread_update_fail_for_not_owner(self):
        url = reverse('forum:update_thread', args=[self.thread.slug])

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
        url = reverse('forum:detail_thread', args=[self.thread.slug])

        response = self.client.get(url) 

        print(response.json())

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json().get('slug'), self.thread.slug)

    def test_delete_thread_delete(self):
        url = reverse('forum:delete_thread', args=[self.thread.slug])

        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_delete_thread_delete_fail_for_not_found(self):
        url = reverse('forum:delete_thread', args=['asasas'])

        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_delete_thread_delete_fail_unauthorized(self):
        url = reverse('forum:delete_thread', args=[self.thread.slug])

        self.client.logout()
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_delete_thread_delete_fail_for_not_owner(self):
        url = reverse('forum:delete_thread', args=[self.thread.slug])
        self.client.logout()
        self.client.force_authenticate(self.user2)

        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(response.json(), {'detail': 'Você não tem permissão para fazer essa ação no post'})

class PostTests(APITestCase, UsersMixin):
    def setUp(self):
        # Criação de um usuário para os testes
        self.user = self.make_user()
        self.user2 = self.make_user_not_autenticated()
        
        self.thread = Thread.objects.create(
            **{'title': 'Test Thread',
            'content': 'Test content for thread',
            'author': self.user }
        )

        self.post = Post.objects.create(
            **{
            'thread': self.thread,
            'content': 'Test content for post',
            'author': self.user}
            )

    def test_post_create_post(self):
        url = reverse('forum:create_post')
        data = {
            'thread': self.thread.slug,
            'content': 'Content for new post',
        }
        
        response = self.client.post(url, data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.json().get('detail'), 'Post criado com sucesso!')

    def test_post_post_create_fail_for_unauthorized(self):
        url = reverse('forum:create_post')
        self.client.logout()

        data = {
            'thread': self.thread.pk,
            'content': 'Content for new post',
            'author': self.user.pk
        }
        
        response = self.client.post(url, data)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_patch_post_update(self):
        url = reverse('forum:post_update', args=[self.post.pk])

        data = {'content': 'Updated content for post'}

        response = self.client.patch(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json().get('detail'), 'Post atualizado com sucesso!')

    def test_patch_post_update_fail_for_404(self):
        url = reverse('forum:post_update', args=[999])

        data = {'content': 'Updated content for post'}
        
        response = self.client.patch(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.json().get('detail'), 'Post não encontrado!')

    def test_patch_post_update_fail_for_unauthorized(self):
        url = reverse('forum:post_update', args=[self.post.pk])

        self.client.logout()

        data = {'content': 'Updated post'}
        
        response = self.client.patch(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_patch_post_update_fail_for_not_owner(self):
        url = reverse('forum:post_update', args=[self.post.pk])
        self.client.logout()
        self.client.force_authenticate(self.user2)

        data = {'content': 'Updated post'}
        
        response = self.client.patch(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(response.json(), {'detail': 'Você não tem permissão para fazer essa ação no post'})


    def test_delete_post_delete(self):
        url = reverse('forum:post_delete', args=[self.post.pk])

        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_delete_post_delete_fail_for_404(self):
        url = reverse('forum:post_delete', args=[999])

        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


    def test_delete_post_delete_fail_for_unauthorized(self):
        url = reverse('forum:post_delete', args=[self.post.pk])
        self.client.logout()

        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_delete_post_delete_fail_for_not_owner(self):
        url = reverse('forum:post_delete', args=[self.post.pk])

        self.client.logout()
        self.client.force_authenticate(self.user2)

        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(response.json(), {'detail': 'Você não tem permissão para fazer essa ação no post'})