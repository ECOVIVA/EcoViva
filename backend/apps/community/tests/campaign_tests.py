from django.urls import reverse
from django.utils.timezone import make_aware
from datetime import datetime
from rest_framework import status
from rest_framework.test import APITestCase
from apps.community.models.community import Community
from apps.community.models.events import Campaign
from apps.users.tests import UsersMixin

class CampaignTests(APITestCase, UsersMixin):
    def setUp(self):
        self.user = self.make_user()
        self.user2 = self.make_user_not_autenticated()

        self.community = Community.objects.create(
            name="Nome da Comunidade",
            description="Esta é uma descrição da comunidade.",
            owner=self.user,
            is_private=False
        )

        self.campaign = Campaign.objects.create(
             community = self.community,
             title = "Campanha insana",
             description = "Campanha aonde temos que reciclar.",
             deadline=make_aware(datetime(2000, 4, 12)),
             goal = "Meta Insana",
             created_by = self.user
        )

        self.campaign.participants.add(self.user2)

    def test_get_campaign_list(self):
        url = reverse('community:campaign-list', args = [self.community.slug])
        
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_campaign_list_fail_for_404(self):
        url = reverse('community:campaign-list', args = ['RANNNNNNNN'])
        
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual('Comunidade não encontrada!', response.json().get('detail'))

    def test_get_campaign_list_fail_for_403(self):
        url = reverse('community:campaign-list', args = [self.community.slug])
        
        self.client.logout
        self.client.force_authenticate(self.user2)

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual('Somente membro da comunidade pode realizar essa ação.' ,response.json().get('detail'))

    def test_get_campaign_list_fail_for_401(self):
        url = reverse('community:campaign-list', args = [self.community.slug])
        
        self.client.logout()

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_get_campaign_object(self):
        url = reverse('community:campaign-detail', args = [self.community.slug, self.campaign.id])
        
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_campaign_object_fail_404_for_community(self):
        url = reverse('community:campaign-detail', args = ['RANNNNNN', self.campaign.id])
        
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_get_campaign_object_fail_404_for_campaign(self):
        url = reverse('community:campaign-detail', args = [self.community.slug, 9999])
        
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual('Campanha não encontrada!', response.json().get('detail'))

    def test_get_campaign_object_fail_403(self):
        url = reverse('community:campaign-detail', args = [self.community.slug, self.campaign.id])
        
        self.client.logout()
        self.client.force_authenticate(self.user2)

        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual('Somente membro da comunidade pode realizar essa ação.', response.json().get('detail'))

    def test_get_campaign_object_fail_401(self):
        url = reverse('community:campaign-detail', args = [self.community.slug, self.campaign.id])
        
        self.client.logout()

        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_post_campaign_create(self):
        url = reverse('community:campaign-create', args = [self.community.slug])

        data = {
            'title':"Challenge de Reciclagem",
            'description' :"Challenge aonde temos que reciclar.",
            'deadline': make_aware(datetime(2000, 4, 12)),
            'goals': 'Reciclar muito.'
        }
        
        response = self.client.post(url, data, format = "json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual('Campanha criada com sucesso!', response.json().get("detail"))

    def test_post_campaign_create_fail_for_404(self):
        url = reverse('community:campaign-create', args = ['RANNNNNNNNNNNNN'])

        data = {
            'title':"Challenge de Reciclagem",
            'description' :"Challenge aonde temos que reciclar.",
            'deadline': make_aware(datetime(2000, 4, 12)),
            'metal_points': 10,
            'paper_points': 8,
            'plastic_points': 5,
            'glass_points': 7
        }
        
        response = self.client.post(url, data, format = "json")

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_post_campaign_create_fail_for_403(self):
        url = reverse('community:campaign-create', args = [self.community.slug])

        self.client.logout()
        self.client.force_authenticate(self.user2)

        data = {
            'title':"Challenge de Reciclagem",
            'description' :"Challenge aonde temos que reciclar.",
            'deadline': make_aware(datetime(2000, 4, 12)),
            'metal_points': 10,
            'paper_points': 8,
            'plastic_points': 5,
            'glass_points': 7
        }
        
        response = self.client.post(url, data, format = "json")

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual('Você precisa ser administrador da comunidade para ter acesso a essa ação.', response.json().get("detail"))

    def test_post_campaign_create_fail_for_401(self):
        url = reverse('community:campaign-create', args = [self.community.slug])

        self.client.logout()

        data = {
            'title':"Challenge de Reciclagem",
            'description' :"Challenge aonde temos que reciclar.",
            'deadline': make_aware(datetime(2000, 4, 12)),
            'metal_points': 10,
            'paper_points': 8,
            'plastic_points': 5,
            'glass_points': 7
        }
        
        response = self.client.post(url, data, format = "json")

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_post_campaign_create_fail_for_400_for_blank(self):
        url = reverse('community:campaign-create', args = [self.community.slug])

        data = {
            'title': ' '
        }
        
        response = self.client.post(url, data, format = "json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('Este campo não pode ser em branco.', response.json().get('title'))

    def test_patch_campaign_update(self):
        url = reverse('community:campaign-update', args = [self.community.slug, self.campaign.pk])

        data = {
            'title':"Challenge de Reciclagem",
            'description' :"Challenge aonde temos que reciclar.",
            'deadline': make_aware(datetime(2000, 4, 12)),
            'goals': 'Reciclar muito.'
        }
        
        response = self.client.patch(url, data, format = "json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual('Campanha atualizada com sucesso!', response.json().get("detail"))

    def test_patch_campaign_update_fail_for_404_for_community(self):
        url = reverse('community:campaign-update', args = ['RANNNNNNNN', self.campaign.id])
        
        data = {
            'title':"Challenge de Reciclagem",
            'description' :"Challenge aonde temos que reciclar.",
            'deadline': make_aware(datetime(2000, 4, 12)),
            'goals': 'Reciclar muito.'
        }
        
        response = self.client.patch(url, data, format = "json")

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_patch_campaign_update_fail_for_404_for_campaign(self):
        url = reverse('community:campaign-update', args = [self.community.slug, 99999])
        
        data = {
            'title':"Challenge de Reciclagem",
            'description' :"Challenge aonde temos que reciclar.",
            'deadline': make_aware(datetime(2000, 4, 12)),
            'goals': 'Reciclar muito.'
        }
        
        response = self.client.patch(url, data, format = "json")

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual('Campanha não encontrada!', response.json().get('detail'))

    def test_patch_campaign_update_fail_403(self):
        url = reverse('community:campaign-update', args = [self.community.slug, self.campaign.id])
        
        self.client.logout()
        self.client.force_authenticate(self.user2)

        data = {
            'title':"Challenge de Reciclagem",
            'description' :"Challenge aonde temos que reciclar.",
            'deadline': make_aware(datetime(2000, 4, 12)),
            'goals': 'Reciclar muito.'
        }
        
        response = self.client.patch(url, data, format = "json")
        
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual('Você precisa ser administrador da comunidade para ter acesso a essa ação.', response.json().get('detail'))

    def test_patch_campaign_update_fail_401(self):
        url = reverse('community:campaign-update', args = [self.community.slug, self.campaign.id])
        
        self.client.logout()

        data = {
            'title':"Challenge de Reciclagem",
            'description' :"Challenge aonde temos que reciclar.",
            'deadline': make_aware(datetime(2000, 4, 12)),
            'goals': 'Reciclar muito.'
        }
        
        response = self.client.patch(url, data, format = "json")
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED) 

    def test_delete_campaign_delete(self):
        url = reverse('community:campaign-delete', args = [self.community.slug, self.campaign.id])
        
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_delete_campaign_delete_fail_for_404_for_community(self):
        url = reverse('community:campaign-delete', args = ['RANNNNNNNN', self.campaign.id])
        
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_delete_campaign_delete_fail_for_404_for_campaign(self):
        url = reverse('community:campaign-delete', args = [self.community.slug, 99999])
        
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual('Campanha não encontrada!', response.json().get('detail'))

    def test_delete_campaign_delete_fail_403(self):
        url = reverse('community:campaign-delete', args = [self.community.slug, self.campaign.id])
        
        self.client.logout()
        self.client.force_authenticate(self.user2)

        response = self.client.delete(url)
        
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual('Você precisa ser administrador da comunidade para ter acesso a essa ação.', response.json().get('detail'))

    def test_delete_campaign_delete_fail_401(self):
        url = reverse('community:campaign-delete', args = [self.community.slug, self.campaign.id])
        
        self.client.logout()

        response = self.client.delete(url)
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_post_campaign_toggle_participant_join(self):
        url = reverse('community:campaign-toggle', args = [self.community.slug, self.campaign.id])

        response = self.client.post(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual('Você esta participando da campanha.', response.json().get('detail'))

    def test_post_campaign_toggle_participant_exit(self):
        url = reverse('community:campaign-toggle', args = [self.community.slug, self.campaign.id])

        response = self.client.post(url)
        response = self.client.post(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual('Você saiu da campanha.', response.json().get('detail'))

    def test_post_campaign_toggle_participant_fail_404_for_community(self):
        url = reverse('community:campaign-toggle', args = ["RANNNNNNNNNNNNN", self.campaign.id])

        response = self.client.post(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual('Campanha não encontrada.', response.json().get('detail'))


    def test_post_campaign_toggle_participant_fail_404_for_campaign(self):
        url = reverse('community:campaign-toggle', args = [self.community.slug, 999])

        response = self.client.post(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual('Campanha não encontrada.', response.json().get('detail'))

    def test_post_campaign_toggle_participant_fail_403(self):
        url = reverse('community:campaign-toggle', args = [self.community.slug, self.campaign.pk])

        self.client.logout()
        self.client.force_authenticate(self.user2)
        response = self.client.post(url)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual('Somente membro da comunidade pode realizar essa ação.', response.json().get('detail'))

    def test_post_campaign_toggle_participant_fail_401(self):
        url = reverse('community:campaign-toggle', args = [self.community.slug, self.campaign.pk])

        self.client.logout()

        response = self.client.post(url)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_get_campaign_participants_list(self):
        url = reverse('community:campaign-participants', args = [self.community.slug, self.campaign.pk])
        
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_campaign_participants_list_fail_for_404(self):
        url = reverse('community:campaign-participants', args = [self.community.slug, 999])
        
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual('Campanha não encontrada!', response.json().get('detail'))

    def test_get_campaign_participants_list_fail_for_403(self):
        url = reverse('community:campaign-participants', args = [self.community.slug, self.campaign.pk])
        
        self.client.logout
        self.client.force_authenticate(self.user2)

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual('Somente membro da comunidade pode realizar essa ação.' ,response.json().get('detail'))

    def test_get_campaign_participants_list_fail_for_401(self):
        url = reverse('community:campaign-participants', args = [self.community.slug, self.campaign.pk])
        
        self.client.logout()

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)