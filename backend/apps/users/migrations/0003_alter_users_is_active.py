# Generated by Django 5.1.7 on 2025-03-26 23:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0002_users_bio'),
    ]

    operations = [
        migrations.AlterField(
            model_name='users',
            name='is_active',
            field=models.BooleanField(default=False),
        ),
    ]
