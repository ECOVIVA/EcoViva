from django.core.exceptions import ValidationError
from PIL import Image
import os

def validate_image_size(image):
    max_size = 5 * 1024 * 1024
    if image.size > max_size:
        raise ValidationError("O arquivo de imagem não pode ser maior que 5MB.")
    
def resize_image_preserve_aspect_ratio(image_path, max_width, max_height):
    if not os.path.exists(image_path):
        return

    with Image.open(image_path) as img:
        img.thumbnail((max_width, max_height))  # Redimensiona mantendo proporção
        img.save(image_path)