from rest_framework import serializers
from . import models

"""
    Este arquivo contém os Serializers responsáveis por converter os dados dos modelos
    em JSON e vice-versa, para que possam ser usados nas APIs.

    Este arquivo é o responsavel por criar o serializer de Posts, validar seus dados e fazer suas operações
    com o Banco de Dados.

"""

class PostsSerializer(serializers.ModelSerializer):
    class Meta:

        # Classe responsavel por definir qual model o serializer vai realizar as operações, e quais campos
        # serão usados por ele.
        
        model = models.Users
        fields = '__all__'