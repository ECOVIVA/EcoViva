from rest_framework import serializers
from django.contrib.auth import authenticate

class LoginUserSerializer(serializers.Serializer):
    email = serializers.EmailField(required = True)
    password = serializers.CharField(write_only = True)

    def validate(self, data):
        user = authenticate(email=data['email'], password=data['password'])

        if user and user.is_active:
            data['user'] = user
            return data
        
        elif user and not user.is_active:
            raise serializers.ValidationError({'detail': "Autentique seu email para conseguir o acesso!!"})
        
        
        raise serializers.ValidationError({'detail': "Usuario ou senha incorreta!!"})