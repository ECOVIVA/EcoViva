from django.urls import reverse
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework import status
from rest_framework.test import APITestCase
from io import BytesIO
from PIL import Image
from apps.community.models.community import Community
from apps.community.models.threads import Thread
from apps.users.tests import UsersMixin

class CommunityTests(APITestCase, UsersMixin):
    def setUp(self):
        self.user = self.make_user()
        self.user2 = self.make_user_not_autenticated()

        self.community = Community.objects.create(
            name="Nome da Comunidade",
            description="Esta é uma descrição da comunidade.",
            owner=self.user,
            is_private=False
        )

        self.community2 = Community.objects.create(
            name="Nome da Comunidade2",
            description="Esta é uma descrição da comunidade.",
            owner=self.user2,
            is_private=False
        )

        self.community_private = Community.objects.create(
            name="Nome da Comunidade Private",
            description="Esta é uma descrição da comunidade2.",
            owner=self.user2,
            is_private=True
        )

        self.community.pending_requests.add(self.user2)

    def test_get_community_list(self):
        url = reverse('community:list_community')

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_community_list_fail_for_404(self):
        url = reverse('community:list_community')

        self.community.delete()
        self.community2.delete()
        self.community_private.delete()

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual('Não há comunidades!', response.json().get('detail'))

    def test_get_community_list_fail_for_401(self):
        url = reverse('community:list_community')

        self.client.logout()

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual('As credenciais de autenticação não foram fornecidas.', response.json().get('detail'))

    def test_get_community_object(self):
        url = reverse('community:detail_community', args=[self.community.slug])

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_community_object_fail_for_404(self):
        url = reverse('community:detail_community', args=['RANNNNNNNNNNNNNNNNNN'])

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual('Comunidade não encontrada!', response.json().get('detail'))

    def test_get_community_object_fail_for_403(self):
        url = reverse('community:detail_community', args=[self.community2.slug])

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual('Somente membro da comunidade pode realizar essa ação.', response.json().get('detail'))


    def test_get_community_object_fail_for_401(self):
        url = reverse('community:detail_community', args=[self.community.slug])

        self.client.logout()

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual('As credenciais de autenticação não foram fornecidas.', response.json().get('detail'))

    def test_post_community_create(self):
        url = reverse('community:create_community')

        data = {
            'name': "Nome da Comunidade Criada",
            'description': "Esta é uma descrição da comunidade.",
            'is_private':False
        }

        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.json().get('detail'), 'Comunidade criada com sucesso!')

    def test_post_community_create(self):
        url = reverse('community:create_community')

        data = {
            'name': "Nome da Comunidade Criada",
            'description': "Esta é uma descrição da comunidade.",
            'is_private':False
        }

        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.json().get('detail'), 'Comunidade criada com sucesso!')

    def test_post_community_create_with_image(self):
        url = reverse('community:create_community')

        image = Image.new('RGB', (1500, 1500), color='red')
        image_file = BytesIO()
        image.save(image_file, format='JPEG')
        image_file.name = 'test_icon.jpg'
        image_file.seek(0)

        icon = SimpleUploadedFile(image_file.name, image_file.read(), content_type="image/jpeg")

        data = {
            'name': "Nome da Comunidade Criada",
            'description': "Esta é uma descrição da comunidade.",
            'is_private':False,
            'icon': icon
        }

        response = self.client.post(url, data, format='multipart')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.json().get('detail'), 'Comunidade criada com sucesso!')

    def test_post_community_create_fail_for_blank_name(self):
        url = reverse('community:create_community')

        data = {
            'name': "",
            'description': "Esta é uma descrição da comunidade.",
            'is_private':False
        }

        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('Este campo não pode ser em branco.', response.json().get('name'))

    def test_post_community_create_fail_for_duplicate_name(self):
        url = reverse('community:create_community')

        data = {
            'name': "Nome da Comunidade",
            'description': "Esta é uma descrição da comunidade.",
            'is_private':False
        }

        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('community com este name já existe.', response.json().get('name'))

    def test_post_community_create_fail_for_invalid_image(self):
        url = reverse('community:create_community')

        image = Image.new('RGB', (1500, 1500), color='red')
        image_file = BytesIO()
        image.save(image_file, format='GIF')
        image_file.name = 'test_icon.gif'
        image_file.seek(0)

        icon = SimpleUploadedFile(image_file.name, image_file.read(), content_type="image/gif")

        data = {
            'name': "Nome da Comunidade Criada",
            'description': "Esta é uma descrição da comunidade.",
            'is_private':False,
            'icon': icon
        }

        response = self.client.post(url, data, format='multipart')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('A extensão de arquivo “gif” não é permitida. As extensões válidas são: jpg, jpeg, png .', response.json().get('icon'))

    def test_post_community_create_fail_for_401(self):
        url = reverse('community:create_community')

        self.client.logout()

        data = {
            'name': "Nome da Comunidade Criada",
            'description': "Esta é uma descrição da comunidade.",
            'is_private':False
        }

        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual('As credenciais de autenticação não foram fornecidas.', response.json().get('detail'))

    def test_patch_community_update(self):
        url = reverse('community:update_community', args=[self.community.slug])

        data = {
            'description': "Esta é uma descrição da comunidade atualizada.",
        }

        response = self.client.patch(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json().get('detail'), 'Comunidade atualizada com sucesso!')

    def test_patch_community_update_fail_for_duplicate_name(self):
        url = reverse('community:update_community', args=[self.community.slug])

        data = {
            'name': self.community2.name
        }

        response = self.client.patch(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('community com este name já existe.', response.json().get('name'))

    def test_patch_community_update_fail_for_404(self):
        url = reverse('community:update_community', args=['RANNNNNNNNNNNN'])

        data = {
            'description': "Esta é uma descrição da comunidade atualizada.",
        }

        response = self.client.patch(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.json().get('detail'), 'Comunidade não encontrada!')

    def test_patch_community_update_fail_for_403(self):
        url = reverse('community:update_community', args=[self.community2.slug])

        data = {
            'description': "Esta é uma descrição da comunidade atualizada.",
        }

        response = self.client.patch(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(response.json().get('detail'), 'Você precisa ser administrador da comunidade para ter acesso a essa ação.')

    def test_patch_community_update_fail_for_401(self):
        url = reverse('community:update_community', args=[self.community2.slug])

        self.client.logout()

        data = {
            'description': "Esta é uma descrição da comunidade atualizada.",
        }

        response = self.client.patch(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual('As credenciais de autenticação não foram fornecidas.', response.json().get('detail'))

    def test_delete_community_delete(self):
        url = reverse('community:delete_community', args=[self.community.slug])

        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(response.data.get('detail'), 'Comunidade deletada com sucesso!')

    def test_delete_community_delete_fail_for_404(self):
        url = reverse('community:delete_community', args=['RANNNNNNNN'])

        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.json().get('detail'), 'Comunidade não encontrada!')

    def test_delete_community_delete_fail_for_403(self):
        url = reverse('community:delete_community', args=[self.community2.slug])

        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(response.json().get('detail'), 'Somente o dono da comunidade pode realizar essa ação.')

    def test_delete_community_delete_fail_for_401(self):
        url = reverse('community:delete_community', args=[self.community.slug])

        self.client.logout()

        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response.json().get('detail'), 'As credenciais de autenticação não foram fornecidas.')

    def test_post_community_register_user(self):
        url = reverse('community:register_user', args=[self.community.slug])

        response = self.client.post(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json().get('detail'), 'Usuário adicionado ao grupo.')

    def test_post_community_register_user_private(self):
        url = reverse('community:register_user', args=[self.community_private.slug])

        response = self.client.post(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json().get('detail'), 'Usuário adicionado a lista de pendencias.')

    def test_post_community_register_user_fail_for_404(self):
        url = reverse('community:register_user', args=['RANNNNNNNN'])

        response = self.client.post(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.json().get('detail'), 'Comunidade não encontrada!')

    def test_post_community_register_user_fail_for_401(self):
        url = reverse('community:register_user', args=[self.community.slug])

        self.client.logout()

        response = self.client.post(url)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response.json().get('detail'), 'As credenciais de autenticação não foram fornecidas.')

    def test_get_community_pending_requests(self):
        url = reverse('community:pending_requests', args=[self.community.slug])

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_community_pending_requests_fail_for_404(self):
        url = reverse('community:pending_requests', args=['RANNNNNNNNNNNNNNNNNNNNN'])

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_get_community_pending_requests_fail_for_403(self):
        url = reverse('community:pending_requests', args=[self.community2.slug])

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_get_community_pending_requests_fail_for_401(self):
        url = reverse('community:pending_requests', args=[self.community.slug])

        self.client.logout()

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_post_community_register_confirmation(self):
        url = reverse('community:pending_confirmation', args=[self.community.slug])

        data = {
            'request_id': self.user2.pk,
            'confirmation': True
        }
        
        response = self.client.post(url, data, format='json' )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json().get('detail'), 'Usuário confirmado como membro.')

    def test_post_community_register_not_confirmation(self):
        url = reverse('community:pending_confirmation', args=[self.community.slug])

        data = {
            'request_id': self.user2.pk,
            'confirmation': False
        }
        
        response = self.client.post(url, data, format='json' )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json().get('detail'), 'Solicitação negada com sucesso.')

    def test_post_communitary_register_confirmation_fail_for_404(self):
        url = reverse('community:pending_confirmation', args=['RANNNNNNNNN'])

        data = {
            'request_id': self.user2.pk,
            'confirmation': False
        }
        
        response = self.client.post(url, data, format='json' )

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_post_communitary_register_confirmation_fail_for_403(self):
        url = reverse('community:pending_confirmation', args=[self.community2.slug])

        data = {
            'request_id': self.user2.pk,
            'confirmation': False
        }
        
        response = self.client.post(url, data, format='json' )

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_post_communitary_register_confirmation_fail_for_401(self):
        url = reverse('community:pending_confirmation', args=[self.community.slug])

        self.client.logout()

        data = {
            'request_id': self.user2.pk,
            'confirmation': False
        }
        
        response = self.client.post(url, data, format='json' )

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
