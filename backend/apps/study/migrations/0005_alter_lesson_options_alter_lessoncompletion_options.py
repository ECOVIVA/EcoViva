# Generated by Django 5.1.7 on 2025-04-06 04:13

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('study', '0004_alter_lesson_categories'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='lesson',
            options={'verbose_name': 'Lesson', 'verbose_name_plural': 'Lessons'},
        ),
        migrations.AlterModelOptions(
            name='lessoncompletion',
            options={'verbose_name': 'LessonCompletion', 'verbose_name_plural': 'LessonsCompletion'},
        ),
    ]
