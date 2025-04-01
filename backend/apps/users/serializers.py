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
    relacionados aos usuários da aplicação. Ele converte os dados de entrada (JSON) para os objetos 
    do modelo de usuário (User) e vice-versa, garantindo que os dados estejam no formato correto 
    antes de serem armazenados no banco de dados ou retornados na resposta.

    A seguir, ele realiza as operações de:
    - Validação dos campos de entrada (como o telefone e a senha).
    - Criação de novos usuários, incluindo a definição segura da senha criptografada.
    - Criação automática de uma bolha associada ao usuário recém-criado.

    A utilização deste serializer assegura que os dados estejam validados e consistentes antes de 
    serem persistidos ou utilizados nas APIs, promovendo uma camada de segurança e confiabilidade 
    no sistema.
"""


class UsersSerializer(serializers.ModelSerializer):

    # Campo para senha, que será usado apenas para escrita (não será retornado nas respostas).
    password = serializers.CharField(write_only=True)

    class Meta:
        # Define o modelo de dados com o qual o serializer irá interagir e os campos que serão usados
        model = models.Users
        fields = ['id', 'username', 'first_name', 'last_name', 'password', 'email', 'phone', 'photo']
    
    # Valida o número de telefone. 
    # O número de telefone deve ter 11 dígitos ou estar no formato (XX) XXXXX-XXXX.
    def validate_phone(self, value):
        # Verifica se o número está no formato sem formatação (11 dígitos).
        if re.match(r'^\d{11}$', value):
            formatted_value = f"({value[:2]}) {value[2:7]}-{value[7:]}"
        # Verifica se o número já está no formato com parênteses e traço.
        elif re.match(r'^\(\d{2}\) \d{5}-\d{4}$', value):
            formatted_value = value
        else:
            # Caso o formato seja inválido, gera um erro.
            raise serializers.ValidationError("Número de telefone inválido. O formato correto é (XX) XXXXX-XXXX ou 119XXXXXXXX.")
        
        return formatted_value
    
    # Valida a senha de acordo com as regras definidas pelo Django.
    # Se a senha não atender aos requisitos, um erro será lançado.
    def validate_password(self, value):
        try:
            # Aplica os validadores de senha do Django, como comprimento mínimo, etc.
            password_validation.validate_password(value)
        except serializers.ValidationError as e:
            # Caso a validação falhe, um erro de validação personalizado será retornado.
            raise serializers.ValidationError({"password": str(e)})
        return value
    
    # Cria o usuário e define sua senha de maneira segura.
    # Após a criação do usuário, uma bolha (Bubble) é automaticamente criada e associada ao usuário.
    def create(self, validated_data):
        # Retira a senha dos dados validados antes de salvar o usuário.
        password = validated_data.pop('password')
        
        # Cria o usuário usando os dados validados, mas sem a senha.
        user = super().create(validated_data)
        
        # Criptografa a senha e associa ao usuário.
        user.set_password(password)
        
        # Salva o usuário no banco de dados.
        user.save()

        # Cria automaticamente uma bolha (Bubble) associada ao novo usuário.
        bubble_data = {'user': user}
        bubble_model = Bubble.objects.create(**bubble_data)

        # Salva a bolha no banco de dados.
        bubble_model.save()
            
        return user
