from django.contrib.auth.models import AbstractUser, BaseUserManager


class UsersManager(BaseUserManager):  # type: ignore
    def create_user(
        self, email: str, password: str | None = None, **extra_fields: object
    ) -> AbstractUser:
        if not email:
            e_msg = "O e-mail é obrigatório!"
            raise ValueError(e_msg)

        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)  # type: ignore
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(
        self, email: str, password: str | None = None, **extra_fields: object
    ) -> AbstractUser:
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_active", True)
        extra_fields.setdefault("is_superuser", True)
        return self.create_user(email, password, **extra_fields)
