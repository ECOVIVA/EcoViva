import os

from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.core.validators import FileExtensionValidator
from django.dispatch import receiver

from utils.image import validate_image_dimensions, validate_image_size

"""
    Modelos para gerenciamento de usuários.

    - UsersManager: Gerenciador customizado para criação de usuários e superusuários.
    - Users: Modelo de usuário customizado baseado no AbstractUser do Django.
    - Interests: Modelo com os campos de interesse que o usuario pode ter
"""

class Interests(models.Model):
    class Meta:
        verbose_name = "Interest"  # Nome do modelo no singular no Django Admin
        verbose_name_plural = "Interests"  # Nome do modelo no plural no Django Admin

    name = models.CharField(max_length=255, unique=True)  # Define o nome como obrigatório e único

    def __str__(self):
        return f"Interesse por {self.name}"
    
class UsersManager(BaseUserManager):
    """
    Gerenciador customizado para o modelo de usuário, responsável por criar usuários e superusuários.

    - create_user: Cria um usuário comum, garantindo e-mail válido e senha criptografada.
    - create_superuser: Cria um superusuário, definindo permissões administrativas.
    """

    def create_user(self, email, password=None, **extra_fields):
        """Cria e salva um novo usuário com e-mail e senha."""
        if not email:
            raise ValueError("O e-mail é obrigatório!")  # Garante que o e-mail seja fornecido
        
        email = self.normalize_email(email)  # Normaliza o e-mail (exemplo: maiúsculas para minúsculas)
        user = self.model(email=email, **extra_fields)  # Cria o objeto do usuário
        user.set_password(password)  # Define a senha criptografada
        user.save(using=self._db)  # Salva o usuário no banco de dados
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        """Cria e salva um superusuário com permissões administrativas."""
        extra_fields.setdefault('is_staff', True)  # Define o usuário como staff
        extra_fields.setdefault('is_active', True)  # Usuário ativo por padrão
        extra_fields.setdefault('is_superuser', True)  # Define como superusuário
        return self.create_user(email, password, **extra_fields)


class Users(AbstractUser):
    """
    Modelo de usuário customizado.

    - email: E-mail único e obrigatório, usado como campo principal de login.
    - bio: Biografia curta do usuário.
    - phone: Número de telefone obrigatório.
    - photo: Foto de perfil com validações de tamanho e formato.
    - is_active: Indica se o usuário está ativo na plataforma.
    - groups/user_permissions: Campos herdados do AbstractUser, mas desativados pois não são utilizados.
    """

    class Meta:
        app_label = 'users'  # Define o nome do app no banco de dados
        verbose_name = "User"  # Nome do modelo no singular no Django Admin
        verbose_name_plural = "Users"  # Nome do modelo no plural no Django Admin

    email = models.EmailField(unique=True, blank=False, null=False)  # Define o e-mail como obrigatório e único
    bio = models.TextField(max_length=256, null=True, default=None)  # Pequena descrição do usuário (opcional)
    interests = models.ManyToManyField(Interests, blank=True,) # Interesses que o usuario pode ter
    phone = models.CharField(max_length=15, blank=False, null=False)  # Número de telefone obrigatório
    photo = models.ImageField(
        upload_to="users_photos",  # Diretório onde as imagens serão armazenadas
        validators=[
            FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png']),  # Aceita apenas formatos específicos
            validate_image_size,  # Valida tamanho máximo do arquivo
            validate_image_dimensions,  # Valida dimensões mínimas e máximas da imagem
        ],
        null=True, 
        blank=True
    )  # Foto de perfil do usuário
    is_active = models.BooleanField(default=False)  # Usuários são inativos por padrão até ativação manual
    objects = UsersManager()  # Usa o gerenciador customizado para lidar com usuários

    # Campos desativados pois não são necessários para este projeto
    groups = None
    user_permissions = None

    # Define o e-mail como campo principal de login
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'phone']  # Campos obrigatórios além do e-mail

    def __str__(self):
        """Retorna uma representação textual do usuário pelo nome de usuário."""
        return f"User {self.username}"


# ----- Sinais -----

@receiver(models.signals.post_delete, sender=Users)
def deletar_imagem_apos_excluir(sender, instance, **kwargs):
    """
    Remove a foto do perfil do usuário quando ele for excluído.
    """
    if instance.photo:
        if os.path.isfile(instance.photo.path):  # Verifica se o arquivo existe no sistema
            os.remove(instance.photo.path)  # Exclui a imagem do diretório


@receiver(models.signals.pre_save, sender=Users)
def delete_old_image(sender, instance, **kwargs):
    """
    Remove a foto de perfil antiga quando o usuário atualiza sua imagem.
    """
    if not instance.pk:  # Se for um novo usuário, não há imagem antiga para excluir
        return

    try:
        old_instance = sender.objects.get(pk=instance.pk)  # Obtém a versão antiga do usuário
    except sender.DoesNotExist:
        return  # Se o usuário não existir, não há nada a excluir

    if old_instance.photo and old_instance.photo != instance.photo:
        if os.path.isfile(old_instance.photo.path):  # Verifica se a imagem antiga existe
            os.remove(old_instance.photo.path)  # Exclui o arquivo da imagem antiga

@receiver(models.signals.post_migrate)
def create_interests(sender, **kwargs):
    """
    Cria automaticamente alguns temas que podem ser do interesse do usuário
    """

    sustainability_interests = [
        "Reciclagem",
        "Compostagem",
        "Reflorestamento",
        "Economia Circular",
        "Redução de Plástico",
        "Conservação da Água",
        "Energias Renováveis",
        "Consumo Consciente",
        "Mobilidade Sustentável",
        "Agricultura Sustentável",
        "Preservação da Biodiversidade",
        "Gestão de Resíduos",
        "Moda Sustentável",
        "Arquitetura Verde",
        "Alimentação Sustentável",
        "Poluição e Controle Ambiental",
        "Ecoeducação",
        "Mudanças Climáticas",
        "Produção Limpa",
        "Zero Waste (Lixo Zero)"
    ]

    # Criando cada rank na base de dados se ainda não existir
    for name in sustainability_interests:
        Interests.objects.get_or_create(name=name)