# Generated by Django 5.1.7 on 2025-04-09 23:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('forum', '0002_thread_cover'),
    ]

    operations = [
        migrations.AddField(
            model_name='thread',
            name='likes',
            field=models.PositiveIntegerField(default=0),
        ),
    ]
