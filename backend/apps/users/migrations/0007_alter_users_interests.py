# Generated by Django 5.1.7 on 2025-04-09 00:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0006_alter_users_interests'),
    ]

    operations = [
        migrations.AlterField(
            model_name='users',
            name='interests',
            field=models.ManyToManyField(blank=True, to='users.interests'),
        ),
    ]
