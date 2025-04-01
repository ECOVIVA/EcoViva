import os

from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import FileExtensionValidator
from django.dispatch import receiver
from django.contrib.auth.models import BaseUserManager
from django.db import models

from utils.image import validate_image_dimensions, validate_image_size

# Gerenciador customizado para o modelo de usuário, que herda de BaseUserManager
class UsersManager(BaseUserManager):
    """
    Gerenciador customizado para o modelo de usuário, responsável por criar usuários e superusuários.
    
    - create_user: Cria um usuário comum, com validação do e-mail e criptografia de senha.
    - create_superuser: Cria um superusuário, definindo os campos de `is_staff` e `is_superuser` como True.
    """
    
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("O e-mail é obrigatório!")
        email = self.normalize_email(email)  # Normaliza o e-mail para garantir que ele seja armazenado corretamente
        user = self.model(email=email, **extra_fields)  # Cria o objeto do usuário
        user.set_password(password)  # Criptografa a senha
        user.save(using=self._db)  # Salva o usuário no banco de dados
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)  # Define o superusuário como staff
        extra_fields.setdefault('is_superuser', True)  # Define o superusuário como superusuário
        return self.create_user(email, password, **extra_fields)


""" 
Modelo de dados para os usuários, herdado do AbstractUser do Django.
Contém campos básicos e personalizados para o gerenciamento de usuários na plataforma.

Campos usados no modelo:
- id: Identificador único do usuário.
- username: Nome de usuário exclusivo.
- first_name: Primeiro nome do usuário.
- last_name: Sobrenome do usuário.
- email: Endereço de e-mail, único e obrigatório.
- phone: Número de telefone do usuário, obrigatório.
- bio: Biografia do usuário, com limite de 256 caracteres.
- photo: Foto de perfil do usuário, com validações de tamanho e formato de imagem.
- is_active: Campo que determina se o usuário está ativo (por padrão, o usuário é inativo).
- groups: Não utilizado, mas exigido pela herança do AbstractUser (definido como None).
- user_permissions: Não utilizado, mas exigido pela herança do AbstractUser (definido como None).

Note que os campos `groups` e `user_permissions` são desativados para este projeto, pois não são necessários.

"""
class Users(AbstractUser):

    # Classe interna Meta que define a configuração do modelo no Django Admin
    class Meta:
        app_label = 'users'  # Define o nome do app no banco de dados
        verbose_name = "User"  # Nome do modelo no singular para o Django Admin
        verbose_name_plural = "Users"  # Nome do modelo no plural para o Django Admin

    email = models.EmailField(unique=True, blank=False, null=False)  # Campo de e-mail único
    bio = models.TextField(max_length=256, null=True, default=None)  # Campo para biografia do usuário
    phone = models.CharField(max_length=15, blank=False, null=False)  # Número de telefone do usuário
    photo = models.ImageField(
        upload_to="users_photos",  # Diretório onde as imagens são salvas
        validators=[
            FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png']),  # Validação de formato de imagem
            validate_image_size,  # Validação de tamanho da imagem
            validate_image_dimensions,  # Validação das dimensões da imagem
        ], 
        null=True, 
        blank=True
    )  # Foto de perfil do usuário
    is_active = models.BooleanField(default=False)  # Define se o usuário está ativo ou não
    objects = UsersManager()  # Gerenciador customizado para o modelo Users

    # Campos não utilizados, mas definidos pela herança de AbstractUser
    groups = None
    user_permissions = None

    # Definindo o campo de e-mail como o campo de login principal
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'phone']  # Campos obrigatórios além do e-mail

    # Representação do modelo em formato string
    def __str__(self):
        return f"User {self.username}"  # Representa o usuário pelo seu nome de usuário


# Função para deletar a foto do usuário após a exclusão do objeto
@receiver(models.signals.post_delete, sender=Users)
def deletar_imagem_apos_excluir(sender, instance, **kwargs):
    """
    Função acionada após a exclusão de um usuário.
    Deleta a imagem do perfil associada ao usuário, se existir.
    """
    if instance.photo:
        if os.path.isfile(instance.photo.path):  # Verifica se o arquivo da imagem existe no sistema
            os.remove(instance.photo.path)  # Remove o arquivo de imagem do sistema


# Função para excluir a foto antiga ao atualizar o campo de imagem de perfil
@receiver(models.signals.pre_save, sender=Users)
def delete_old_image(sender, instance, **kwargs):
    """
    Função acionada antes de salvar um novo objeto de usuário.
    Deleta a imagem de perfil antiga se o campo `photo` for atualizado.
    """
    if not instance.pk:  # Se for um novo objeto, não faz nada
        return

    try:
        old_instance = sender.objects.get(pk=instance.pk)  # Obtém a versão antiga do objeto
    except sender.DoesNotExist:
        return  # Se o objeto não existir, não faz nada

    # Verifica se a foto foi alterada
    if old_instance.photo and old_instance.photo != instance.photo:
        if os.path.isfile(old_instance.photo.path):  # Verifica se a imagem antiga existe no sistema
            os.remove(old_instance.photo.path)  # Remove o arquivo da imagem antiga
