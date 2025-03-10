from rest_framework import serializers
from django.contrib.auth import authenticate

class LoginUserSerializer(serializers.Serializer):
    email = serializers.EmailField(required = True)
    password = serializers.CharField(write_only = True)

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            data['user'] = user
            return data
        
        raise serializers.ValidationError({'detail': "Credenciais Incorretas!!"})