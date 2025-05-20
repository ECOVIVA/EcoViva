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

        self.community = Community.objects.create(
            name="Nome da Comunidade",
            description="Esta é uma descrição da comunidade.",
            owner=self.user,
            is_private=False
        )

        self.community_private = Community.objects.create(
            name="Nome da Comunidade2",
            description="Esta é uma descrição da comunidade2.",
            owner=self.user,
            is_private=True
        )

    def test_get_community_list(self):
        url = reverse('community:list_community')

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_community_list_fail_for_404(self):
        url = reverse('community:list_community')

        self.community.delete()
        self.community_private.delete()

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual('Não há comunidades!', response.json().get('detail'))