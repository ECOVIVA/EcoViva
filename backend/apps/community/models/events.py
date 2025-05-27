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
    
class Challenge(BaseEvent):
    metal_points = models.PositiveIntegerField(verbose_name="Metal Points")
    paper_points = models.PositiveIntegerField(verbose_name="Paper Points")
    plastic_points = models.PositiveIntegerField(verbose_name="Plastic Points")
    glass_points = models.PositiveIntegerField(verbose_name="Glass Points")

    class Meta:
        verbose_name = "Gincana"
        verbose_name_plural = "Gincanas"

class ChallengeCompetitor(models.Model):

    gincana = models.ForeignKey(
       Challenge, on_delete=models.CASCADE, related_name='competitor_groups',
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
    
class ChallengeRecord(models.Model):
    gincana = models.ForeignKey(Challenge, on_delete=models.CASCADE, related_name='collection_records')
    competitor_group = models.ForeignKey(ChallengeCompetitor, on_delete=models.CASCADE, related_name='collection_records')
    registered_by = models.ForeignKey(Users, on_delete=models.SET_NULL, null=True, blank=True, related_name='collection_records')
    
    metal_qty = models.PositiveIntegerField(default=0)
    paper_qty = models.PositiveIntegerField(default=0)
    plastic_qty = models.PositiveIntegerField(default=0)
    glass_qty = models.PositiveIntegerField(default=0)

    collected_at = models.DateTimeField(default=timezone.now)

    class Meta:
        verbose_name = "Challenge Record"
        verbose_name_plural = "Challenge Records"
        ordering = ['-collected_at']

    def __str__(self):
        return f"Coleta {self.competitor_group.name} em {self.collected_at.strftime('%Y-%m-%d')}"

class Campaign(BaseEvent):
    goal = models.TextField(blank=True, null=True, verbose_name="Goal")
    participants = models.ManyToManyField(Users, blank=True, related_name="campaign_member")

    class Meta:
        verbose_name = "Campaign"
        verbose_name_plural = "Campaigns"

@receiver(models.signals.post_save, sender=ChallengeRecord)
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