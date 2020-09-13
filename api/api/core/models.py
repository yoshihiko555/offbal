from django.db import models
from django.contrib.auth.base_user import BaseUserManager
from django.utils.translation import ugettext_lazy as _


class TimeStampModel(models.Model):

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class TaskModel(models.Model):

    content = models.TextField(_('Content'))

    label = models.ManyToManyField(
        'api.Label',
        blank=True
    )

    class Priority(models.TextChoices):
        ONE = '1', _('One')
        TWO = '2', _('Two')
        THREE = '3', _('Three')
        FOUR = '4', _('Four')
        FIVE = '5', _('Five')

    priority = models.CharField(
        max_length=50,
        choices=Priority.choices,
        default=Priority.ONE
    )

    start_time = models.DateTimeField(null=True, blank=True)
    deadline = models.DateTimeField(null=True, blank=True)
    remind = models.DateTimeField(null=True, blank=True)
    comment = models.TextField(null=True, blank=True)
    completed = models.BooleanField(default=False)
    completed_at = models.DateTimeField(null=True, blank=True)
    deleted = models.BooleanField(default=False)

    def __str__(self):
        return self.content
