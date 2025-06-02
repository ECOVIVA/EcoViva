from django.urls import reverse
from django.utils.timezone import make_aware
from datetime import datetime
from rest_framework import status
from rest_framework.test import APITestCase
from apps.community.models.community import Community
from apps.community.models.events import Challenge, ChallengeCompetitor, ChallengeRecord
from apps.users.tests import UsersMixin

class ChallengeTests(APITestCase, UsersMixin):
    def setUp(self):
        self.user = self.make_user()
        self.user2 = self.make_user_not_autenticated()

        self.community = Community.objects.create(
            name="Nome da Comunidade",
            description="Esta é uma descrição da comunidade.",
            owner=self.user,
            is_private=False
        )

        self.challenge = Challenge.objects.create(
             community = self.community,
             title = "Challenge de Reciclagem",
             description = "Challenge aonde temos que reciclar.",
             deadline=make_aware(datetime(2000, 4, 12)),
             metal_points = 1,
             paper_points = 1,
             plastic_points = 1,
             glass_points = 1
        )

        self.competitor = ChallengeCompetitor.objects.create(
            challenge = self.challenge,
            name = 'Group'
        )

    def test_get_challenge_list(self):
        url = reverse('community:challenge-list', args = [self.community.slug])
        
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_challenge_list_fail_for_404(self):
        url = reverse('community:challenge-list', args = ['RANNNNNNNN'])
        
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual('Gincanas não encontradas!' ,response.json().get('detail'))

    def test_get_challenge_list_fail_for_403(self):
        url = reverse('community:challenge-list', args = [self.community.slug])
        
        self.client.logout
        self.client.force_authenticate(self.user2)

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual('Somente membro da comunidade pode realizar essa ação.' ,response.json().get('detail'))

    def test_get_challenge_list_fail_for_401(self):
        url = reverse('community:challenge-list', args = [self.community.slug])
        
        self.client.logout()

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_get_challenge_object(self):
        url = reverse('community:challenge-detail', args = [self.community.slug, self.challenge.id])
        
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_challenge_object_fail_404_for_community(self):
        url = reverse('community:challenge-detail', args = ['RANNNNNN', self.challenge.id])
        
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_get_challenge_object_fail_404_for_challenge(self):
        url = reverse('community:challenge-detail', args = [self.community.slug, 9999])
        
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual('Gincana não encontrada!', response.json().get('detail'))

    def test_get_challenge_object_fail_403(self):
        url = reverse('community:challenge-detail', args = [self.community.slug, self.challenge.id])
        
        self.client.logout()
        self.client.force_authenticate(self.user2)

        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual('Somente membro da comunidade pode realizar essa ação.', response.json().get('detail'))

    def test_get_challenge_object_fail_401(self):
        url = reverse('community:challenge-detail', args = [self.community.slug, self.challenge.id])
        
        self.client.logout()

        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_post_challenge_create(self):
        url = reverse('community:challenge-create', args = [self.community.slug])

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

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual('Gincana criada com sucesso!', response.json().get("detail"))

    def test_post_challenge_create_fail_for_404(self):
        url = reverse('community:challenge-create', args = ['RANNNNNNNNNNNNN'])

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

    def test_post_challenge_create_fail_for_403(self):
        url = reverse('community:challenge-create', args = [self.community.slug])

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

    def test_post_challenge_create_fail_for_401(self):
        url = reverse('community:challenge-create', args = [self.community.slug])

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

    def test_post_challenge_create_fail_for_400_for_blank(self):
        url = reverse('community:challenge-create', args = [self.community.slug])

        data = {
            'title': ''
        }
        
        response = self.client.post(url, data, format = "json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('Este campo não pode ser em branco.', response.json().get('title'))

    def test_post_challenge_create_fail_for_400_for_deadline_invalid(self):
        url = reverse('community:challenge-create', args = [self.community.slug])

        data = {
            'title':"Challenge de Reciclagem",
            'description' :"Challenge aonde temos que reciclar.",
            'deadline': 'asasas',
            'metal_points': 10,
            'paper_points': 8,
            'plastic_points': 5,
            'glass_points': 7
        }
        
        response = self.client.post(url, data, format = "json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('Formato inválido para data e hora. Use um dos formatos a seguir: YYYY-MM-DDThh:mm[:ss[.uuuuuu]][+HH:MM|-HH:MM|Z].', response.json().get('deadline'))

    def test_delete_challenge_delete(self):
        url = reverse('community:challenge-delete', args = [self.community.slug, self.challenge.pk])
        
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_delete_challenge_delete_fail_for_404_for_community(self):
        url = reverse('community:challenge-delete', args = ['RANNNNNNNN', self.challenge.id])
        
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_delete_challenge_delete_fail_for_404_for_challenge(self):
        url = reverse('community:challenge-delete', args = [self.community.slug, 99999])
        
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual('Gincana não encontrada!', response.json().get('detail'))

    def test_delete_challenge_delete_fail_403(self):
        url = reverse('community:challenge-delete', args = [self.community.slug, self.challenge.id])
        
        self.client.logout()
        self.client.force_authenticate(self.user2)

        response = self.client.delete(url)
        
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual('Você precisa ser administrador da comunidade para ter acesso a essa ação.', response.json().get('detail'))

    def test_delete_challenge_delete_fail_401(self):
        url = reverse('community:challenge-delete', args = [self.community.slug, self.challenge.id])
        
        self.client.logout()

        response = self.client.delete(url)
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_post_create_competitor(self):
        url = reverse('community:challenge-competitor-create', args = [self.community.slug, self.challenge.pk])

        data = {
           'name' :  'Group 1'
        }
        
        response = self.client.post(url, data, format = "json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_post_create_competitor_many(self):
        url = reverse('community:challenge-competitor-create', args = [self.community.slug, self.challenge.pk])

        data = [{
           'name' :  'Group 1'
        },{
            'name': "Group 2"
        }]
        
        response = self.client.post(url, data, format = "json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_post_create_competitor_fail_for_404_for_community(self):
        url = reverse('community:challenge-competitor-create', args = ['RANNNNNNNNNN', self.challenge.pk])

        data = {
           'name' :  'Group 1'
        }
        
        response = self.client.post(url, data, format = "json")

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


    def test_post_create_competitor_fail_for_404_for_challenge(self):
        url = reverse('community:challenge-competitor-create', args = [self.community.slug, 999])

        data = {
           'name' :  'Group 1'
        }
        
        response = self.client.post(url, data, format = "json")

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual('Gincana não encontrada!', response.json().get('detail'))

    def test_post_create_competitor_fail_for_403(self):
        url = reverse('community:challenge-competitor-create', args = [self.community.slug, self.challenge.pk])

        self.client.logout()
        self.client.force_authenticate(self.user2)

        data = {
           'name' :  'Group 1'
        }
        
        response = self.client.post(url, data, format = "json")

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_post_create_competitor_fail_for_401(self):
        url = reverse('community:challenge-competitor-create', args = [self.community.slug, self.challenge.pk])

        self.client.logout()

        data = {
           'name' :  'Group 1'
        }
        
        response = self.client.post(url, data, format = "json")

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_post_create_competitor_fail_for_400_fail_for_blank(self):
        url = reverse('community:challenge-competitor-create', args = [self.community.slug, self.challenge.pk])

        data = {
           'name' :  ''
        }
        
        response = self.client.post(url, data, format = "json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('Este campo não pode ser em branco.', response.json().get('name'))

    def test_post_create_competitor_fail_for_400_fail_for_duplicate(self):
        url = reverse('community:challenge-competitor-create', args = [self.community.slug, self.challenge.pk])

        data = [{
           'name' : "Group1"
        },
        {
            'name': "Group1"
        }]
        
        response = self.client.post(url, data, format = "json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('Existem nomes duplicados na lista enviada.', response.json().get('non_field_errors'))

    def test_delete_challenge_competitor_delete(self):
        url = reverse('community:challenge-competitor-delete', args = [self.community.slug, self.challenge.id, self.competitor.pk])
        
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_delete_challenge_competitor_delete_fail_for_404_for_community(self):
        url = reverse('community:challenge-competitor-delete', args = ['RANNNNNNNN', self.challenge.id, self.competitor.pk])
        
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_delete_challenge_competitor_delete_fail_for_404_for_challenge(self):
        url = reverse('community:challenge-competitor-delete', args = [self.community.slug, 99999, self.competitor.pk])
        
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_delete_challenge_competitor_delete_fail_403(self):
        url = reverse('community:challenge-competitor-delete', args = [self.community.slug, self.challenge.id, self.competitor.pk])
        
        self.client.logout()
        self.client.force_authenticate(self.user2)

        response = self.client.delete(url)
        
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual('Você precisa ser administrador da comunidade para ter acesso a essa ação.', response.json().get('detail'))

    def test_delete_challenge_competitor_delete_fail_401(self):
        url = reverse('community:challenge-competitor-delete', args = [self.community.slug, self.challenge.id, self.competitor.pk])
        
        self.client.logout()

        response = self.client.delete(url)
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_post_competitor_record(self):
        url = reverse('community:challenge-record-create', args = [self.community.slug, self.challenge.id])

        data = {
           'competitor_group': self.competitor.pk,
           'metal_qty': 1,
           'paper_qty': 1,
           'plastic_qty': 1,
           'glass_qty': 1
        }
        
        response = self.client.post(url, data, format = "json")

        print(response.json())
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual('Registro criado com sucesso!', response.json().get('detail'))

        self.competitor.refresh_from_db()

        self.assertEqual(self.competitor.points, 4)

    def test_posts_competitor_record_fail_for_404_for_community(self):
        url = reverse('community:challenge-record-create', args = ["RA", self.challenge.pk])

        data = {
           'metal_qty': 1,
           'paper_qty': 1,
           'plastic_qty': 1,
           'glass_qty': 1
        }
        
        response = self.client.post(url, data, format = "json")

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_posts_competitor_record_fail_for_404_for_challenge(self):
        url = reverse('community:challenge-record-create', args = [self.community.slug, 999])

        data = {
           'metal_qty': 1,
           'paper_qty': 1,
           'plastic_qty': 1,
           'glass_qty': 1
        }
        
        response = self.client.post(url, data, format = "json")

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


    def test_posts_competitor_record_fail_for_403(self):
        url = reverse('community:challenge-record-create', args = [self.community.slug, self.challenge.pk])

        self.client.logout()
        self.client.force_authenticate(self.user2)

        data = {
            'competitor_group': self.competitor.pk,
           'metal_qty': 1,
           'paper_qty': 1,
           'plastic_qty': 1,
           'glass_qty': 1
        }
        
        response = self.client.post(url, data, format = "json")

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual('Você precisa ser administrador da comunidade para ter acesso a essa ação.', response.json().get('detail'))

    def test_posts_competitor_record_fail_for_401(self):
        url = reverse('community:challenge-record-create', args = [self.community.slug, self.challenge.id])

        self.client.logout()

        data = {
           'metal_qty': 1,
           'paper_qty': 1,
           'plastic_qty': 1,
           'glass_qty': 1
        }
        
        response = self.client.post(url, data, format = "json")

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    