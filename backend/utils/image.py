from django.core.exceptions import ValidationError
from PIL import Image

def validate_image_size(image):
    max_size = 5 * 1024 * 1024
    if image.size > max_size:
        raise ValidationError("O arquivo de imagem não pode ser maior que 5MB.")

# Função de validação de dimensões
def validate_image_dimensions(image):
    img = Image.open(image)
    max_width = 1200
    max_height = 1200
    if img.width > max_width or img.height > max_height:
        raise ValidationError(f"As dimensões da imagem não podem exceder {max_width}x{max_height} pixels.")