from rest_framework import serializers
from django.contrib.auth import authenticate

"""
    Este arquivo contém o serializer responsável pelo processo de login do usuário.

    O `LoginUserSerializer` valida as credenciais fornecidas e tenta autenticar o usuário 
    com base no email e senha. Ele assegura que apenas usuários ativos possam acessar o sistema.
"""

class LoginUserSerializer(serializers.Serializer):
    """
    Serializer para autenticação de usuário.

    - Recebe um email e uma senha.
    - Tenta autenticar o usuário utilizando as credenciais fornecidas.
    - Se o usuário não existir ou a senha estiver incorreta, retorna um erro.
    - Se o usuário existir, mas não estiver ativo, informa que o email precisa ser autenticado.
    """

    # Campo de email obrigatório para login
    email = serializers.EmailField(required=True)

    # Campo de senha configurado como write-only (não será retornado na resposta)
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        """
        Valida as credenciais e autentica o usuário.

        - Tenta autenticar o usuário com `authenticate(email, password)`.
        - Se as credenciais forem corretas e o usuário estiver ativo, retorna os dados.
        - Se o usuário não estiver ativo, gera um erro informando que o email precisa ser autenticado.
        - Se o usuário ou senha forem inválidos, retorna um erro informando que as credenciais estão incorretas.
        """
        
        # Tenta autenticar o usuário com as credenciais fornecidas
        user = authenticate(email=data['email'], password=data['password'])

        if user:
            if user.is_active:
                data['user'] = user  # Adiciona o usuário autenticado aos dados retornados
                return data
            else:
                # Retorna erro se o usuário existir, mas não estiver ativo
                raise serializers.ValidationError({'detail': "Autentique seu email para conseguir o acesso!!"})

        # Retorna erro se as credenciais estiverem incorretas
        raise serializers.ValidationError({'detail': "Usuário ou senha incorretos!!"})
