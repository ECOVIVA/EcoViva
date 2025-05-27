from django.urls import reverse
from django.utils.timezone import make_aware
from datetime import datetime
from rest_framework import status
from rest_framework.test import APITestCase
from apps.community.models.community import Community
from apps.community.models.events import Campanha
from apps.users.tests import UsersMixin

class GincanaTests(APITestCase, UsersMixin):
    def setUp(self):
        self.user = self.make_user()
        self.user2 = self.make_user_not_autenticated()

        self.community = Community.objects.create(
            name="Nome da Comunidade",
            description="Esta é uma descrição da comunidade.",
            owner=self.user,
            is_private=False
        )

        self.campaign = Campanha.objects.create(
             community = self.community,
             title = "Campanha insana",
             description = "Campanha aonde temos que reciclar.",
             deadline=make_aware(datetime(2000, 4, 12)),
             goal = "Meta Insana"
        )

    def test_get_campaign_list(self):
        url = reverse('community:campanha-list', args = [self.community.slug])
        
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

