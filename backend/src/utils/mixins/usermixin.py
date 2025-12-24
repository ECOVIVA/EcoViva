from apps.users import models

class UsersMixin:
    def make_user(
        self,
        first_name='user',
        last_name='name',
        username='username',
        password='SenhaMuitoSegura123',
        email='username@email.com',
        phone='(11) 11111-1111',
        photo=None,
    ):
        user = models.Users.objects.create_user(
            first_name=first_name,
            last_name=last_name,
            username=username,
            password=password,
            email=email,
            phone=phone,
            is_active = True

        )

        # Autentica o usuário (corrigido para o método correto)
        self.client.force_authenticate(user)

        return user
    
    def make_user_for_comparison(
        self,
        first_name='user2',
        last_name='name2',
        username='username2',
        password='SenhaMuitoSegura321',
        email='username2@email.com',
        phone='(22) 22222-2222',
        photo=None
    ):
        # Cria um usuário para comparação
        user = models.Users.objects.create_user(
            first_name=first_name,
            last_name=last_name,
            username=username,
            password=password,
            email=email,
            phone=phone,
            is_active = True
        )
    
        # Autentica o usuário criado
        self.client.force_authenticate(user)

        return user
    
    def make_user_not_autenticated(
        self,
        first_name='user2',
        last_name='name2',
        username='username2',
        password='SenhaMuitoSegura321',
        email='username2@email.com',
        phone='(22) 22222-2222',
        photo=None
    ):
        # Cria um usuário para comparação
        user = models.Users.objects.create_user(
            first_name=first_name,
            last_name=last_name,
            username=username,
            password=password,
            email=email,
            phone=phone,
            is_active = True
        )

        return user