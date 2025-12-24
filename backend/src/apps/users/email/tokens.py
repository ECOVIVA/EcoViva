from django.contrib.auth.tokens import PasswordResetTokenGenerator

class EmailConfirmationTokenGenerator(PasswordResetTokenGenerator):
    def _make_hash_value(self, user, timestamp):
        """Gera um hash único baseado no ID do usuário e no status de ativação."""
        return f"{user.pk}{timestamp}{user.is_active}"

email_confirmation_token = EmailConfirmationTokenGenerator()