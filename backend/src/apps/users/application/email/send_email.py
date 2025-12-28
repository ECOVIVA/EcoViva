from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import get_template
from django.urls import reverse
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode

from apps.users.infrastructure.models.user import Users

from .tokens import email_confirmation_token


def send_confirmation_email(user: Users) -> None:
    uidb64 = urlsafe_base64_encode(force_bytes(user.pk))
    token = email_confirmation_token.make_token(user)

    confirmation_url = settings.BACKEND_URL + reverse("confirm_email", args=[uidb64, token])

    subject = "Confirme seu e-mail"
    from_email = settings.DEFAULT_FROM_EMAIL
    recipient_list = [user.email]

    context: dict[str, object] = {"user": user, "confirmation_url": confirmation_url}
    html_content = get_template("users/confirm_email.html").render(context)

    text_content = "Clique no link para confirmar seu e-mail: " + confirmation_url

    email = EmailMultiAlternatives(subject, text_content, from_email, recipient_list)
    email.attach_alternative(html_content, "text/html")

    email.send()
