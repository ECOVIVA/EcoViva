from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from apps.community.models.threads import Thread, Post, Community
from apps.users.tests import UsersMixin

class PostTests(APITestCase, UsersMixin):
    def setUp(self):
        # Criação de um usuário para os testes
        self.user = self.make_user()
        self.user2 = self.make_user_not_autenticated()
        
        self.community = Community.objects.create(
            name="Nome da Comunidade",
            description="Esta é uma descrição da comunidade.",
            owner=self.user,
            is_private=True  # ou False, conforme desejado
        )

        self.thread = Thread.objects.create(
            **{'community' : self.community,
            'title': 'Test Thread',
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
        url = reverse('community:create_post', args = [self.community.slug, self.thread.slug])
        data = {
            'content': 'Content for new post',
        }
        
        response = self.client.post(url, data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.json().get('detail'), 'Post criado com sucesso!')

    def test_post_post_create_fail_for_unauthorized(self):
        url = reverse('community:create_post', args = [self.community.slug, self.thread.slug])
        self.client.logout()

        data = {
            'thread': self.thread.pk,
            'content': 'Content for new post',
            'author': self.user.pk
        }
        
        response = self.client.post(url, data)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_patch_post_update(self):
        url = reverse('community:post_update', args=[self.community.slug, self.thread.slug, self.post.pk])

        data = {'content': 'Updated content for post'}

        response = self.client.patch(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json().get('detail'), 'Post atualizado com sucesso!')

    def test_patch_post_update_fail_for_404(self):
        url = reverse('community:post_update', args=[self.community.slug, self.thread.slug, 999])

        data = {'content': 'Updated content for post'}
        
        response = self.client.patch(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.json().get('detail'), 'Post não encontrado!')

    def test_patch_post_update_fail_for_unauthorized(self):
        url = reverse('community:post_update', args=[self.community.slug, self.thread.slug, self.post.pk])

        self.client.logout()

        data = {'content': 'Updated post'}
        
        response = self.client.patch(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_patch_post_update_fail_for_not_owner(self):
        url = reverse('community:post_update', args=[self.community.slug, self.thread.slug, self.post.pk])
        self.client.logout()
        self.client.force_authenticate(self.user2)

        data = {'content': 'Updated post'}
        
        response = self.client.patch(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(response.json(), {'detail': 'Você não tem permissão para fazer essa ação no post'})


    def test_delete_post_delete(self):
        url = reverse('community:post_delete', args=[self.community.slug, self.thread.slug, self.post.pk])

        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_delete_post_delete_fail_for_404(self):
        url = reverse('community:post_delete', args=[self.community.slug, self.thread.slug, 999])

        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


    def test_delete_post_delete_fail_for_unauthorized(self):
        url = reverse('community:post_delete', args=[self.community.slug, self.thread.slug, self.post.pk])
        self.client.logout()

        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_delete_post_delete_fail_for_not_owner(self):
        url = reverse('community:post_delete', args=[self.community.slug, self.thread.slug, self.post.pk])

        self.client.logout()
        self.client.force_authenticate(self.user2)

        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(response.json(), {'detail': 'Você não tem permissão para fazer essa ação no post'})