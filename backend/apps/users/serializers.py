from rest_framework import serializers
from django.contrib.auth import password_validation
import re
from apps.bubble.models import Bubble
from . import models

"""
    Este arquivo contém os Serializers responsáveis por converter os dados dos modelos 
    em formato JSON e vice-versa, facilitando a comunicação entre o backend e o frontend 
    nas APIs.

    O serializer `UsersSerializer` é responsável pela validação, criação e manipulação dos dados 
    relacionados aos usuários da aplicação. Ele realiza as seguintes operações:

    - Validação dos campos de entrada (como telefone e senha).
    - Criação de novos usuários com senha criptografada.
    - Criação automática de uma bolha (Bubble) associada ao usuário recém-criado.

    O uso deste serializer garante que os dados estejam validados e consistentes antes de 
    serem armazenados no banco de dados ou retornados na API, promovendo segurança e confiabilidade.
"""

class InterestsSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Interests  # Define o modelo associado ao serializer
        fields = ['name']  

# Serializer para o modelo de usuário (Users)
class UsersSerializer(serializers.ModelSerializer):
    """
    Serializa os dados do modelo de usuário.

    - Inclui validações personalizadas para o telefone e a senha.
    - Define a senha como um campo de escrita apenas (write-only).
    - Ao criar um usuário, uma bolha (Bubble) associada é automaticamente gerada.
    """
    
    # Campo de senha configurado como write-only (não será retornado na resposta).
    interests = serializers.SlugRelatedField(
        many=True,
        slug_field='name',
        queryset=models.Interests.objects.all(),
        required=False
    )
    password = serializers.CharField(write_only=True)

    class Meta:
        model = models.Users  # Define o modelo associado ao serializer
        fields = ['id', 'username', 'first_name', 'last_name', 'password', 'email','bio' ,'interests' ,'phone', 'photo']  # Campos incluídos na serialização
    
    def validate_phone(self, value):
        """
        Valida e formata o número de telefone.

        - O telefone deve ter 11 dígitos ou estar no formato (XX) XXXXX-XXXX.
        - Se estiver sem formatação, será convertido para o formato correto.
        - Se estiver mal formatado, um erro de validação será gerado.
        """
        if re.match(r'^\d{11}$', value):  # Verifica se contém apenas os 11 dígitos
            formatted_value = f"({value[:2]}) {value[2:7]}-{value[7:]}"
        elif re.match(r'^\(\d{2}\) \d{5}-\d{4}$', value):  # Verifica se já está formatado corretamente
            formatted_value = value
        else:
            raise serializers.ValidationError("Número de telefone inválido. O formato correto é (XX) XXXXX-XXXX ou 119XXXXXXXX.")

        return formatted_value

    def validate_password(self, value):
        """
        Valida a senha de acordo com as regras do Django.

        - Verifica se a senha atende aos critérios de segurança.
        - Se a senha não for válida, um erro personalizado é retornado.
        """
        try:
            password_validation.validate_password(value)  # Valida a senha usando as regras do Django
        except serializers.ValidationError as e:
            raise serializers.ValidationError({"password": str(e)})  # Retorna o erro de validação
        return value
    
    def validate_bio(self, value):
        max_line_breaks = 5
        line_breaks = value.count('\n')
        if line_breaks > max_line_breaks:
            raise serializers.ValidationError(f'Máximo de {max_line_breaks} quebras de linha permitidas.')
        return value

    def create(self, validated_data):
        """
        Cria um novo usuário com senha segura e uma bolha associada.

        - Remove a senha do conjunto de dados antes de criar o usuário.
        - Define a senha de maneira criptografada.
        """
        password = validated_data.pop('password')
        interests = validated_data.pop('interests', [])  # Extrai os interesses

        user = models.Users.objects.create(**validated_data)  # Cria o usuário
        user.set_password(password)
        user.save()

        user.interests.set(interests)  # Associa os interesses ao usuário

        return user
    
    def update(self, instance, validated_data):
        interests_data = validated_data.pop('interests', None)
        for attr, value in validated_data.items():
            if attr == 'password':
                instance.set_password(value)
            else:
                setattr(instance, attr, value)
        instance.save()
        if interests_data is not None:
            instance.interests.set(interests_data)
        return instance