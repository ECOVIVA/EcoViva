import os
from django.db import models
from django.utils import timezone
from django.utils.text import slugify
from django.core.validators import FileExtensionValidator
from django.dispatch import receiver

from utils.image import validate_image_size, resize_image_preserve_aspect_ratio
from apps.users.models import Users

"""
    Modelos da aplicação para Threads, Posts e Tags.

    - Tags: Representa as categorias associadas às threads.
    - Thread: Representa um tópico de discussão no fórum.
    - Post: Representa as respostas dentro de uma thread.
"""

class Tags(models.Model):
    """
    Modelo que representa uma tag utilizada para categorizar threads.

    - name: Nome único da tag.
    """

    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name  # Retorna o nome da tag para facilitar a identificação


class Community(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(unique=True, blank=True, null=False)
    description = models.TextField()
    banner = models.ImageField(upload_to='community_banners/', blank=True, null=True)
    icon = models.ImageField(upload_to='community_icons/', blank=True, null=True, validators=[
            FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png']),
            validate_image_size,
        ],)
    owner = models.ForeignKey(Users, on_delete=models.CASCADE, related_name="communities_owned")
    admins = models.ManyToManyField(Users, blank=True, related_name="communities_admin")
    pending_requests = models.ManyToManyField(Users, blank=True, related_name="communities_pending")
    members = models.ManyToManyField(Users, blank=True, related_name="communities_member")
    created_at = models.DateTimeField(auto_now_add=True)
    is_private = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

class Event(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    date = models.DateTimeField()

    location = models.CharField(max_length=255, blank=True)
    is_online = models.BooleanField(default=False)
    link = models.URLField(blank=True, null=True)

    community = models.ForeignKey(Community, on_delete=models.CASCADE, related_name='events')
    created_by = models.ForeignKey(Users, on_delete=models.SET_NULL, null=True, related_name='events_created')
    participants = models.ManyToManyField(Users, blank=True, related_name='events_joined')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-date']

    def __str__(self):
        return f"{self.title} - {self.community.name}"
    
class Thread(models.Model):
    """
    Modelo que representa uma thread (tópico de discussão).

    - cover: Imagem de capa da thread.
    - title: Título da thread.
    - slug: Identificador único baseado no título.
    - content: Conteúdo da thread.
    - tags: Tags associadas à thread.
    - author: Usuário que criou a thread.
    - created_at: Data de criação.
    - updated_at: Data da última modificação.
    """

    community = models.ForeignKey(Community, on_delete=models.CASCADE)
    cover = models.ImageField(
        upload_to="threads_cover",  # Define o diretório de upload das imagens de capa
        validators=[
            FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png']),  # Restringe formatos de imagem
            validate_image_size,  # Valida o tamanho da imagem
        ],
        null=True, 
        blank=True
    )
    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, blank=False)
    content = models.TextField()
    likes = models.ManyToManyField(Users, related_name='liked_threads', blank=True)
    tags = models.ManyToManyField(Tags, blank=True)  # Relacionamento muitos-para-muitos com Tags
    author = models.ForeignKey(Users, on_delete=models.CASCADE)  # Relaciona a thread a um usuário
    created_at = models.DateTimeField(default=timezone.now)  # Define a data de criação automaticamente
    updated_at = models.DateTimeField(auto_now=True)  # Atualiza a data toda vez que a thread for alterada

    def save(self, *args, **kwargs):
        """ 
        Gera um slug único baseado no título da thread e evita duplicações. 
        """
        self.slug = slugify(self.title)  # Converte o título para um slug formatado

        unique_slug = self.slug
        counter = 1

        # Garante que o slug seja único
        while self.__class__.objects.filter(slug=unique_slug).exists():
            unique_slug = f"{self.slug}-{counter}"
            counter += 1
        
        self.slug = unique_slug  # Atualiza o slug com um valor único

        super().save(*args, **kwargs)  # Chama o método padrão de salvamento

    def __str__(self):
        return self.title  # Retorna o título da thread para facilitar a identificação

class Post(models.Model):
    """
    Modelo que representa um post dentro de uma thread.

    - thread: Thread à qual o post pertence.
    - content: Conteúdo do post.
    - author: Usuário que criou o post.
    - created_at: Data de criação.
    - updated_at: Data da última modificação.
    - parent_post: Post ao qual este post está respondendo (caso seja uma resposta).
    """

    thread = models.ForeignKey(Thread, on_delete=models.CASCADE, related_name='posts')  # Relaciona o post à thread
    content = models.TextField()
    author = models.ForeignKey(Users, on_delete=models.CASCADE)  # Relaciona o post a um usuário
    created_at = models.DateTimeField(default=timezone.now)  # Define a data de criação automaticamente
    updated_at = models.DateTimeField(auto_now=True)  # Atualiza a data toda vez que o post for alterado

    def __str__(self):
        """
        Retorna uma string representativa do post, indicando se é uma resposta ou um post principal.
        """
        if self.parent_post:
            return f'Resposta de {self.author.username} para o post {self.parent_post.id} em "{self.thread.title}"'
        return f'Post de {self.author.username} em "{self.thread.title}"'

# ----- Signals -----

@receiver(models.signals.post_delete, sender=Thread)
def deletar_imagem_apos_excluir(sender, instance, **kwargs):
    """ 
    Remove a imagem de capa do servidor quando a thread for excluída.
    """
    if instance.cover:  # Verifica se a thread possui uma imagem de capa
        if os.path.isfile(instance.cover.path):  # Garante que o arquivo existe
            os.remove(instance.cover.path)  # Exclui o arquivo de imagem


@receiver(models.signals.pre_save, sender=Thread)
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

    if old_instance.cover and old_instance.cover != instance.cover:
        if os.path.isfile(old_instance.cover.path):  # Verifica se a imagem antiga existe
            os.remove(old_instance.cover.path)  # Exclui o arquivo da imagem antiga

@receiver(models.signals.post_save, sender=Thread)
def resize_cover_image(sender, instance, **kwargs):
    if instance.cover:
        cover_path = instance.cover.path
        resize_image_preserve_aspect_ratio(cover_path, 800, 600)

@receiver(models.signals.post_save, sender=Community)
def owner_is_admin(sender, instance, **kwargs):
    if instance.owner and instance.owner not in instance.admins.all():
        instance.admins.add(instance.owner)
        instance.members.add(instance.owner)

@receiver(models.signals.post_delete, sender=Community)
def deletar_imagens_apos_excluir(sender, instance, **kwargs):
    """Remove as imagens do servidor quando a comunidade for excluída."""
    for image_field in [instance.banner, instance.icon]:
        if image_field and hasattr(image_field, 'path') and os.path.isfile(image_field.path):
            os.remove(image_field.path)

@receiver(models.signals.pre_save, sender=Community)
def deletar_imagens_antigas_ao_salvar(sender, instance, **kwargs):
    """Remove imagens antigas quando os campos forem atualizados."""
    if not instance.pk:
        return

    try:
        old_instance = sender.objects.get(pk=instance.pk)
    except sender.DoesNotExist:
        return

    for field_name in ['banner', 'icon']:
        old_file = getattr(old_instance, field_name)
        new_file = getattr(instance, field_name)

        if old_file and old_file != new_file and hasattr(old_file, 'path') and os.path.isfile(old_file.path):
            os.remove(old_file.path)

@receiver(models.signals.post_save, sender=Community)
def resize_community_images(sender, instance, **kwargs):
    # Verifica se a imagem do banner precisa ser redimensionada
    if instance.banner:
        banner_path = instance.banner.path
        resize_image_preserve_aspect_ratio(banner_path, 800, 600)

    # Verifica se a imagem do ícone precisa ser redimensionada
    if instance.icon:
        icon_path = instance.icon.path
        resize_image_preserve_aspect_ratio(icon_path, 250, 250)