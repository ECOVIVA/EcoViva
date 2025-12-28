from pathlib import Path

from django.core.exceptions import ValidationError
from django.core.files.uploadedfile import UploadedFile
from PIL import Image


def validate_image_size(image: UploadedFile) -> None:
    max_size = 5 * 1024 * 1024

    if image.size > max_size:
        e_msg = "O arquivo de imagem não pode ser maior que 5MB."
        raise ValidationError(e_msg)


def resize_image_preserve_aspect_ratio(
    image_path: str | Path,
    max_width: int,
    max_height: int,
) -> None:
    path = Path(image_path)

    if not path.exists():
        return

    with Image.open(path) as img:
        img.thumbnail((max_width, max_height))
        img.save(path)
