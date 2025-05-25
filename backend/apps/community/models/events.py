from django.db import models
from django.utils import timezone
from django.dispatch import receiver
from apps.users.models import Users
from .community import Community

class BaseEvent(models.Model):
    community = models.ForeignKey(
        Community, 
        on_delete=models.CASCADE, 
        verbose_name="Community"
    )
    created_by = models.ForeignKey(
        Users, 
        on_delete=models.SET_NULL, 
        null=True, 
        related_name='%(class)ss_created',
        verbose_name="Created By"
    )
    
    title = models.CharField(max_length=100, verbose_name="Title")
    description = models.TextField(verbose_name="Description")
    deadline = models.DateTimeField(verbose_name="Deadline")
    
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Created At")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Updated At")

    class Meta:
        abstract = True
        verbose_name = "Base Event"
        verbose_name_plural = "Base Events"
    
class Gincana(BaseEvent):
    metal_points = models.PositiveIntegerField(verbose_name="Metal Points")
    paper_points = models.PositiveIntegerField(verbose_name="Paper Points")
    plastic_points = models.PositiveIntegerField(verbose_name="Plastic Points")
    glass_points = models.PositiveIntegerField(verbose_name="Glass Points")

    class Meta:
        verbose_name = "Gincana"
        verbose_name_plural = "Gincanas"

class GincanaCompetitor(models.Model):

    gincana = models.ForeignKey(
        Gincana, on_delete=models.CASCADE, related_name='competitor_groups',
        verbose_name="Gincana"
    )
    name = models.CharField(max_length=100, verbose_name="Group Name")
    points = models.PositiveIntegerField(blank=True, default=0)
    members = models.ManyToManyField(
        Users, blank=True, related_name='gincana_groups',
        verbose_name="Members"
    )

    class Meta:
        verbose_name = "Gincana Competitor"
        verbose_name_plural = "Gincana Competitors"
        unique_together = ('gincana', 'name')

    def __str__(self):
        return f"{self.name} - {self.gincana.title}"
    
class GincanaRecord(models.Model):
    gincana = models.ForeignKey(Gincana, on_delete=models.CASCADE, related_name='collection_records')
    competitor_group = models.ForeignKey(GincanaCompetitor, on_delete=models.CASCADE, related_name='collection_records')
    registered_by = models.ForeignKey(Users, on_delete=models.SET_NULL, null=True, blank=True, related_name='collection_records')
    
    metal_qty = models.PositiveIntegerField(default=0)
    paper_qty = models.PositiveIntegerField(default=0)
    plastic_qty = models.PositiveIntegerField(default=0)
    glass_qty = models.PositiveIntegerField(default=0)

    collected_at = models.DateTimeField(default=timezone.now)

    class Meta:
        verbose_name = "Gincana Record"
        verbose_name_plural = "Gincana Records"
        ordering = ['-collected_at']

    def __str__(self):
        return f"Coleta {self.competitor_group.name} em {self.collected_at.strftime('%Y-%m-%d')}"

class Campanha(BaseEvent):
    goal = models.TextField(blank=True, null=True, verbose_name="Goal")

    class Meta:
        verbose_name = "Campaign"
        verbose_name_plural = "Campaigns"

class CampanhaParticipant(models.Model):
    campanha = models.ForeignKey(
        Campanha, on_delete=models.CASCADE, related_name='participants',
        verbose_name="Campaign"
    )
    user = models.ForeignKey(Users, on_delete=models.CASCADE, verbose_name="User")
    joined_at = models.DateTimeField(auto_now_add=True, verbose_name="Joined At")

    class Meta:
        verbose_name = "Campaign Participant"
        verbose_name_plural = "Campaign Participants"

    def __str__(self):
        return f"{self.user.username} - {self.campanha.title}"

class Quiz(models.Model):
    title = models.CharField(max_length=100, verbose_name="Quiz Title")
    description = models.TextField(blank=True, null=True, verbose_name="Description")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Created At")

    gincana = models.ForeignKey(
        'Gincana', null=True, blank=True, on_delete=models.CASCADE, related_name='quizzes',
        verbose_name="Gincana"
    )
    campanha = models.ForeignKey(
        'Campanha', null=True, blank=True, on_delete=models.CASCADE, related_name='quizzes',
        verbose_name="Campaign"
    )

    class Meta:
        verbose_name = "Quiz"
        verbose_name_plural = "Quizzes"

    def __str__(self):
        return self.title
    
class QuizQuestion(models.Model):
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name='questions', verbose_name="Quiz")
    text = models.CharField(max_length=255, verbose_name="Question Text")

    class Meta:
        verbose_name = "Quiz Question"
        verbose_name_plural = "Quiz Questions"

    def __str__(self):
        return self.text
    
class QuizOption(models.Model):
    question = models.ForeignKey(QuizQuestion, on_delete=models.CASCADE, related_name='options', verbose_name="Question")
    text = models.CharField(max_length=255, verbose_name="Option Text")
    is_correct = models.BooleanField(default=False, verbose_name="Is Correct")

    class Meta:
        verbose_name = "Quiz Option"
        verbose_name_plural = "Quiz Options"

    def __str__(self):
        return f"{self.text} ({'Correct' if self.is_correct else 'Incorrect'})"
    
class QuizAnswer(models.Model):
    user = models.ForeignKey(Users, on_delete=models.CASCADE, verbose_name="User")
    question = models.ForeignKey(QuizQuestion, on_delete=models.CASCADE, verbose_name="Question")
    selected_option = models.ForeignKey(QuizOption, on_delete=models.SET_NULL, null=True, verbose_name="Selected Option")

    answered_at = models.DateTimeField(auto_now_add=True, verbose_name="Answered At")

    class Meta:
        unique_together = ('user', 'question')
        verbose_name = "Quiz Answer"
        verbose_name_plural = "Quiz Answers"

@receiver(models.signals.post_save, sender=GincanaRecord)
def points_for_record(sender, instance, created, **kwargs):
    if not created:
        return  

    gincana = instance.gincana
    competitor = instance.competitor_group

    pontos = (
        instance.metal_qty * gincana.metal_points +
        instance.paper_qty * gincana.paper_points +
        instance.plastic_qty * gincana.plastic_points +
        instance.glass_qty * gincana.glass_points
    )

    competitor.points += pontos
    competitor.save()