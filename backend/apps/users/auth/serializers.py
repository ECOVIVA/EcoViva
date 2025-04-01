from rest_framework import serializers
from django.contrib.auth import authenticate

class LoginUserSerializer(serializers.Serializer):
    """
    Serializer para login de usuário. Ele valida o email e a senha fornecidos e tenta autenticar o usuário.
    Se o usuário não for encontrado ou a senha estiver incorreta, ele gera um erro de validação.
    """

    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        """
        Valida o email e a senha fornecidos. Tenta autenticar o usuário e garante que o email tenha sido verificado.
        """
        
        # Tenta autenticar o usuário utilizando a função 'authenticate' com o email e a senha fornecidos
        user = authenticate(email=data['email'], password=data['password'])

        # Se o usuário for encontrado e estiver ativo, adiciona o usuário no dicionário de dados e retorna os dados
        if user and user.is_active:
            data['user'] = user
            return data
        
        # Se o usuário for encontrado, mas não estiver ativo, gera um erro de validação informando que o e-mail não foi confirmado
        elif user and not user.is_active:
            raise serializers.ValidationError({'detail': "Autentique seu email para conseguir o acesso!!"})
        
        # Se o usuário não for encontrado ou a senha estiver incorreta, gera um erro de validação
        raise serializers.ValidationError({'detail': "Usuario ou senha incorreta!!"})
