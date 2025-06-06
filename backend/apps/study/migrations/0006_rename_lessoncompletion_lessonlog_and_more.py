# Generated by Django 5.1.7 on 2025-04-21 00:35

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('study', '0005_alter_lesson_options_alter_lessoncompletion_options'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.RenameModel(
            old_name='LessonCompletion',
            new_name='LessonLog',
        ),
        migrations.AlterUniqueTogether(
            name='userachievement',
            unique_together=None,
        ),
        migrations.RemoveField(
            model_name='userachievement',
            name='achievement',
        ),
        migrations.RemoveField(
            model_name='userachievement',
            name='user',
        ),
        migrations.AlterModelOptions(
            name='achievement',
            options={'verbose_name': 'Achievement', 'verbose_name_plural': 'Achievements'},
        ),
        migrations.AlterModelOptions(
            name='lessonlog',
            options={'verbose_name': 'LessonLog', 'verbose_name_plural': 'LessonsLog'},
        ),
        migrations.AddField(
            model_name='achievement',
            name='category',
            field=models.CharField(default=1, max_length=50),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='achievement',
            name='condition',
            field=models.CharField(default=12, max_length=100),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='achievement',
            name='icon',
            field=models.ImageField(blank=True, null=True, upload_to='achievements/'),
        ),
        migrations.AlterField(
            model_name='achievement',
            name='name',
            field=models.CharField(max_length=100, unique=True),
        ),
        migrations.CreateModel(
            name='AchievementLog',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date_awarded', models.DateField(auto_now_add=True)),
                ('achievement', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='study.achievement')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'unique_together': {('user', 'achievement')},
            },
        ),
        migrations.DeleteModel(
            name='AchievementRule',
        ),
        migrations.DeleteModel(
            name='UserAchievement',
        ),
    ]
