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
        
        # Criação de uma thread para os testes
        self.thread_data = {
            'title': 'Test Thread',
            'content': 'Test content for thread',
            'author': self.user
        }

        self.thread = Thread.objects.create(**self.thread_data)

    def test_thread_list(self):
        url = reverse('forum:list_thread')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_create_thread_success(self):
        url = reverse('forum:create_thread')
        data = {
            'title': 'New Thread',
            'content': 'Content for new thread',
            'author': self.user.id,
        }

        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.json(), {'detail': 'Thread criada com sucesso!'})

    def test_create_thread_success_with_tags(self):
        url = reverse('forum:create_thread')
        data = {
            'title': 'New Thread',
            'content': 'Content for new thread',
            'author': self.user.id,
            'tags': ['Django', 'Python', 'API']
        }

        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        new_thread = Thread.objects.get(title='New Thread')  # Busca a thread recém-criada
        tag_names = set(new_thread.tags.values_list("name", flat=True))
        self.assertEqual(tag_names, {'django', 'python', 'api'})

    def test_create_thread_success_with_cover(self):
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
            'author': self.user.id,
            'cover': cover
        }

        response = self.client.post(url, data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        thread = Thread.objects.get(title = data['title'])

        thread.cover.delete()        
    
    def test_create_thread_fail_for_unauthorized(self):
        url = reverse('forum:create_thread')

        self.client.logout()

        data = {
            'title': '',
            'content': 'Content for new thread',
            'author': self.user.id
        }

        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_thread_fail_for_title_blank(self):
        url = reverse('forum:create_thread')

        data = {
            'title': '',
            'content': 'Content for new thread',
            'author': self.user.id
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.json(), {'title': ['Este campo não pode ser em branco.']})


    def test_create_thread_fail_for_lenght_255(self):
        url = reverse('forum:create_thread')

        title_255 = ''

        while len(title_255) < 256:
            title_255 += 'a'

        data = {
            'title': title_255,
            'content': 'Content for new thread',
            'author': self.user.id
        }
        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.json(), {'title': ['Certifique-se de que este campo não tenha mais de 255 caracteres.']})

    def test_create_thread_fail_for_invalid_tags(self):
        """Testa a falha ao criar uma thread com tags em formato inválido"""
        url = reverse('forum:create_thread')

        data = {
            'title': 'Thread com tags inválidas',
            'content': 'Content for new thread',
            'author': self.user.id,
            'tags': 'django, python'  # Não é uma lista
        }
        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.json(), {'tags': ['Necessário uma lista de itens, mas recebeu tipo "str".']})

    def test_create_thread_fail_for_cover_size(self):
        url = reverse('forum:create_thread')

        image = Image.new('RGB', (2000, 2000), color='red')
        image_file = BytesIO()
        image.save(image_file, format='JPEG')
        image_file.name = 'test_cover.jpg'
        image_file.seek(0) 

        cover = SimpleUploadedFile(image_file.name, image_file.read(), content_type="image/jpeg")

        data = {
            'title': 'New Thread',
            'content': 'Content for new thread',
            'author': self.user.id,
            'cover': cover
        }

        response = self.client.post(url, data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.json()['cover'][0], 'As dimensões da imagem não podem exceder 1200x1200 pixels.')

    def test_create_thread_fail_for_cover_type(self):
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
        print(response.json())
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.json()['cover'][0], 'A extensão de arquivo “gif” não é permitida. As extensões válidas são: jpg, jpeg, png .')

    def test_thread_update_success(self):
        url = reverse('forum:update_thread', args=[self.thread.slug])

        data = {
            'title': 'New_Title',
            'tags': ['Updated', 'Thread', 'Test']
        }

        response = self.client.patch(url, data, format='json')

        self.thread.refresh_from_db()

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json(),  {'detail': 'Thread atualizada com sucesso!'})
        self.assertEqual(self.thread.slug, slugify(data['title']))

        tag_names = set(self.thread.tags.values_list("name", flat=True))
        self.assertEqual(tag_names, {'updated', 'thread', 'test'})

    def test_thread_update_fail_for_404(self):
        url = reverse('forum:update_thread', args=[999])

        data = {
            'title': 'Error_Test',
        }

        response = self.client.patch(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.json(), {'detail': 'Thread não encontrada!'})

    def test_thread_update_fail_for_invalid_tags(self):
        """Testa a falha ao atualizar uma thread com tags inválidas"""
        url = reverse('forum:update_thread', args=[self.thread.slug])

        data = {
            'tags': 'invalid_format' 
        }

        response = self.client.patch(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.json(), {'tags': ['Necessário uma lista de itens, mas recebeu tipo "str".']})

    def test_thread_update_fail_for_unauthorized(self):
        url = reverse('forum:update_thread', args=[self.thread.slug])

        self.client.logout()

        data = {
            'title': 'New_Title',
            'tags': ['Updated', 'Thread', 'Test']
        }

        response = self.client.patch(url, data, format='json')

        self.thread.refresh_from_db()

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_thread_update_fail_for_not_owner(self):
        url = reverse('forum:update_thread', args=[self.thread.slug])

        self.client.logout()
        self.client.force_authenticate(self.user2)

        data = {
            'title': 'New_Title',
            'tags': ['Updated', 'Thread', 'Test']
        }

        response = self.client.patch(url, data, format='json')

        self.thread.refresh_from_db()

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(response.json(), {'detail': 'Você não tem permissão para fazer essa ação no post'})

    def test_thread_detail(self):
        url = reverse('forum:detail_thread', args=[self.thread.slug])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertContains(response, 'Test Thread')

    def test_thread_delete(self):
        url = reverse('forum:delete_thread', args=[self.thread.slug])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_thread_delete_fail_for_not_found(self):
        url = reverse('forum:delete_thread', args=[999])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_thread_delete_fail_unauthorized(self):
        url = reverse('forum:delete_thread', args=[self.thread.slug])

        self.client.logout()
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_thread_delete_fail_for_not_owner(self):
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
        
        # Criação de uma thread para os testes
        self.thread_data = {
            'title': 'Test Thread',
            'content': 'Test content for thread',
            'author': self.user
        }
        self.thread = Thread.objects.create(**self.thread_data)

        # Criação de um post na thread
        self.post_data = {
            'thread': self.thread,
            'content': 'Test content for post',
            'author': self.user
        }

        self.post = Post.objects.create(**self.post_data)

        self.post_data_reply = {
            'thread': self.thread,
            'content': 'Reply_for_Test',
            'author': self.user,
            'parent_post': self.post
        }

        self.reply = Post.objects.create(**self.post_data_reply)

    def test_post_list(self):
        url = reverse('forum:thread_posts', args=[self.thread.slug])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['replies'][0]['id'], self.reply.pk)

    def test_create_post(self):
        url = reverse('forum:create_post')
        data = {
            'thread': self.thread.pk,
            'content': 'Content for new post',
            'author': self.user.pk
        }
        
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data, {'detail': 'Post criado com sucesso!'})

    def test_create_post_unauthorized(self):
        url = reverse('forum:create_post')
        self.client.logout()

        data = {
            'thread': self.thread.pk,
            'content': 'Content for new post',
            'author': self.user.pk
        }
        
        response = self.client.post(url, data)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_post_update(self):
        url = reverse('forum:post_update', args=[self.post.pk])
        data = {'content': 'Updated content for post'}

        response = self.client.patch(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertContains(response, 'Updated content for post')

    def test_post_update_fail_for_404(self):
        url = reverse('forum:post_update', args=[999])
        data = {'content': 'Updated content for post'}
        
        response = self.client.patch(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data['detail'], 'Post não encontrado!')

    def test_post_update_fail_for_unauthorized(self):
        url = reverse('forum:post_update', args=[self.post.pk])
        self.client.logout()

        data = {'content': 'Updated post'}
        
        response = self.client.patch(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_post_update_fail_for_not_owner(self):
        url = reverse('forum:post_update', args=[self.post.pk])
        self.client.logout()
        self.client.force_authenticate(self.user2)

        data = {'content': 'Updated post'}
        
        response = self.client.patch(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(response.json(), {'detail': 'Você não tem permissão para fazer essa ação no post'})


    def test_post_delete(self):
        url = reverse('forum:post_delete', args=[self.post.pk])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_post_delete_fail(self):
        url = reverse('forum:post_delete', args=[999])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


    def test_post_delete_fail_for_unauthorized(self):
        url = reverse('forum:post_delete', args=[self.post.pk])
        self.client.logout()

        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_post_delete_fail_for_not_owner(self):
        url = reverse('forum:post_delete', args=[self.post.pk])

        self.client.logout()
        self.client.force_authenticate(self.user2)

        
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(response.json(), {'detail': 'Você não tem permissão para fazer essa ação no post'})