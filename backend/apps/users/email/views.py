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
    """
    Classe que lida com a confirmação do e-mail do usuário.
    Esta view é acionada quando o usuário clica no link de confirmação enviado por e-mail.
    """
    permission_classes = [permissions.AllowAny]  # Permite acesso sem autenticação (qualquer um pode confirmar o e-mail)
    
    def get(self, request, uidb64, token):
        try:
            # Decodifica o ID do usuário a partir da URL
            uid = force_str(urlsafe_base64_decode(uidb64))
            
            # Tenta buscar o usuário pelo ID decodificado, ou retorna 404 se não encontrado
            user = get_object_or_404(Users, pk=uid)

            # Verifica se o usuário já está com o e-mail confirmado
            if user.is_active:
                return Response({"detail": 'O Usuario já tem o email autenticado.'}, status=status.HTTP_400_BAD_REQUEST)

            # Verifica se o token é válido para o usuário
            if email_confirmation_token.check_token(user, token):
                user.is_active = True  # Marca o usuário como ativo
                user.save()  # Salva as alterações no banco de dados
                return Response({"message": "E-mail confirmado com sucesso!"}, status=status.HTTP_200_OK)
            else:
                return Response({"error": "Token inválido ou expirado."}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            # Retorna um erro genérico caso algo inesperado aconteça
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class ResendConfirmationEmailView(APIView):
    """
    Classe para reenvio do e-mail de confirmação.
    Essa view é utilizada quando o usuário precisa que o link de confirmação seja reenviado.
    """
    def post(self, request):
        email = request.data.get("email")  # Obtém o e-mail enviado na requisição
        
        try:
            # Tenta encontrar o usuário pelo e-mail
            user = Users.objects.get(email=email)

            # Se o usuário já estiver ativo, não envia o e-mail de confirmação novamente
            if user.is_active:
                return Response({"message": "Usuário já está ativo."}, status=status.HTTP_400_BAD_REQUEST)

            # Envia o e-mail de confirmação para o usuário
            send_confirmation_email(user)
            return Response({"message": "E-mail de confirmação reenviado com sucesso."}, status=status.HTTP_200_OK)
        except Users.DoesNotExist:
            # Retorna erro se o e-mail não for encontrado no banco de dados
            return Response({"error": "Email não encontrado."}, status=status.HTTP_404_NOT_FOUND)
