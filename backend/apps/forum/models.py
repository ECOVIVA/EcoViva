import os
from django.db import models
from django.utils import timezone
from django.utils.text import slugify
from django.core.validators import FileExtensionValidator
from django.dispatch import receiver

from utils.image import validate_image_dimensions, validate_image_size
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

    cover = models.ImageField(
        upload_to="threads_cover",  # Define o diretório de upload das imagens de capa
        validators=[
            FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png']),  # Restringe formatos de imagem
            validate_image_size,  # Valida o tamanho da imagem
            validate_image_dimensions  # Valida as dimensões da imagem
        ],
        null=True, 
        blank=True
    )
    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, blank=False)
    content = models.TextField()
    likes = models.PositiveIntegerField(default=0, blank=True)
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


# ----- Sinais para manipulação de arquivos de imagem -----

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
    Remove a imagem antiga quando a capa da thread for alterada. 
    """
    if not instance.pk:  # Se a thread ainda não existir no banco de dados, não faz nada
        return

    try:
        old_instance = sender.objects.get(pk=instance.pk)  # Obtém a versão anterior da thread
    except sender.DoesNotExist:
        return

    # Se a thread já tinha uma imagem e o campo for atualizado com uma nova imagem
    if old_instance.cover and old_instance.cover != instance.cover:  
        if os.path.isfile(old_instance.cover.path):  # Verifica se a imagem antiga existe
            os.remove(old_instance.cover.path)  # Exclui a imagem antiga do servidor


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
    parent_post = models.ForeignKey('self', null=True, blank=True, on_delete=models.CASCADE)  # Permite respostas a posts

    def __str__(self):
        """
        Retorna uma string representativa do post, indicando se é uma resposta ou um post principal.
        """
        if self.parent_post:
            return f'Resposta de {self.author.username} para o post {self.parent_post.id} em "{self.thread.title}"'
        return f'Post de {self.author.username} em "{self.thread.title}"'
