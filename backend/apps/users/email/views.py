from django.shortcuts import get_object_or_404
from django.urls import reverse
from django.utils.http import urlsafe_base64_decode
from django.utils.encoding import force_str
from django.core.mail import send_mail
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from ..models import Users
from .tokens import email_confirmation_token
from .send_email import send_confirmation_email

class EmailConfirmAPIView(APIView):
    permission_classes = [permissions.AllowAny]
    def get(self, request, uidb64, token):
        try:
            # Decodifica o ID do usuário
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = get_object_or_404(Users, pk=uid)

            if user.is_active:
                return Response({"detail": 'O Usuario já tem o email autenticado.'}, status=status.HTTP_400_BAD_REQUEST)

            # Verifica se o token é válido
            if email_confirmation_token.check_token(user, token):
                user.is_active = True
                user.save()
                return Response({"message": "E-mail confirmado com sucesso!"}, status=status.HTTP_200_OK)
            else:
                return Response({"error": "Token inválido ou expirado."}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
class ResendConfirmationEmailView(APIView):
    def post(self, request):
        email = request.data.get("email")
        
        try:
            user = Users.objects.get(email=email)
            if user.is_active:
                return Response({"message": "Usuário já está ativo."}, status=status.HTTP_400_BAD_REQUEST)

            send_confirmation_email(user)
            return Response({"message": "E-mail de confirmação reenviado com sucesso."}, status=status.HTTP_200_OK)
        except Users.DoesNotExist:
            return Response({"error": "Email não encontrado."}, status=status.HTTP_404_NOT_FOUND)
