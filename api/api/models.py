from django.db import models
from django.contrib.auth.models import PermissionsMixin
from django.contrib.auth.base_user import AbstractBaseUser, BaseUserManager
from django.utils.translation import ugettext_lazy as _
from django.core.mail import send_mail
from .core.models import (
    TimeStampModel,
    TaskModel
)
import os, uuid, logging

logger = logging.getLogger(__name__)


class UserManager(BaseUserManager):

    use_in_migrations = True

    def _create_user(self, username, password, **extra_fields):

        if not username:
            raise ValueError('ユーザーネームは必須項目です。')

#         email = self.normalize_email(email)
        username = self.model.normalize_username(username)
        user = self.model(username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)

        mSetting.objects.create(
            target_user=user
        )
        project = Project.objects.create(
            name='インボックス'
        )
        project.member.add(user)

        return user

    def create_user(self, username, password=None, **extra_fields):

        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)

        return self._create_user(username, password, **extra_fields)

    def create_superuser(self, username, password=None, **extra_fields):

        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self._create_user(username, password, **extra_fields)



class mUser(AbstractBaseUser,
            PermissionsMixin,
            TimeStampModel):

    auth0_id = models.CharField(_('Auth0Id'), max_length=255, unique=True)
    auth0_name = models.CharField(_('Auth0Name'), max_length=255, unique=False)
    username = models.CharField(_('Username'), max_length=70, unique=True, blank=True, null=True)
#     email = models.EmailField(_('Email'), max_length=70, unique=True)
    address = models.CharField(_('Address'), max_length=100, blank=True, null=True)

    deleted = models.BooleanField(
        _('Delete Flag'),
        default=False,
        help_text=_(
            'Designates whether the user was deleted or not'
        )
    )

    is_staff = models.BooleanField(
        _('Staff Status'),
        default=False,
        help_text=_(
            'Designates whether the user can log into this admin site.'
        ),
    )

    is_active = models.BooleanField(
        _('Active Flag'),
        default=True,
        help_text=_(
            'Designates whether this user should be treated as active. '
            'Unselect this instead of deleting accounts.'
        ),
    )

    objects = UserManager()

    USERNAME_FIELD = 'username'
#     EMAIL_FIELD = 'email'
#     REQUIRED_FIELDS = ['email']

    class Meta:
        verbose_name = _('user')
        verbose_name_plural = _('users')

    def __str__(self):
        name = self.auth0_name if self.auth0_name != '' else self.username
        return name

    def get_username(self):
        return self.username

    def email_user(self, subject, message, from_email=None, **kwargs):
        send_mail(subject, message, from_email, [self.email], **kwargs)


class Week(models.Model,):

    class WeekInfo(models.TextChoices):
        SUNDAY = '日曜日', _('Sunday')
        MONDAY = '月曜日', _('Monday')
        TUESDAY = '火曜日', _('Tuesday')
        WEDNESDAY = '水曜日', _('Wednesday')
        THURSDAY = '木曜日', _('Thursday')
        FRIDAY = '金曜日', _('Friday')
        SATURDAY = '土曜日', _('Saturday')

    day_of_week =  models.CharField(
        max_length=10,
        choices=WeekInfo.choices,
        default=WeekInfo.MONDAY
    )

    def __str__(self):
        return self.day_of_week


class mSetting(models.Model):

    class WeekInfo(models.TextChoices):
        SUNDAY = 'Sun.', _('Sunday')
        MONDAY = 'Mon.', _('Monday')
        TUESDAY = 'Tue.', _('Tuesday')
        WEDNESDAY = 'Wed.', _('Wednesday')
        THURSDAY = 'Thu.', _('Thursday')
        FRIDAY = 'Fri.', _('Friday')
        SATURDAY = 'Sta.', _('Saturday')

    class Language(models.TextChoices):
        JAPANESE = 'japanese', _('Japanese')
        ENGLISH = 'english', _('English')
        FRENCH = 'french', _('French')
        GERMAN = 'german', _('German')

    class Timezone(models.TextChoices):
        AMERICA_LOS_ANGELES = '(UTF-08:00) 太平洋標準時(米国およびカナダ)', _('America Los Angeles')
        ASIA_TOKYO = '(UTF+09:00) 大阪、札幌、東京', _('Asia Tokyo')

    class Theme(models.TextChoices):
        DEFAULT = 'default', _('Default')
        DARK = 'dark', _('Dark')

    target_user = models.ForeignKey(
        mUser,
        on_delete=models.CASCADE,
        related_name='setting_target_user'
    )

    language = models.CharField(
        max_length=30,
        choices=Language.choices,
        default=Language.JAPANESE
    )

    time_zone = models.CharField(
        max_length=50,
        choices=Timezone.choices,
        default=Timezone.ASIA_TOKYO
    )

    weekly_beginning = models.CharField(
        max_length=10,
        choices=WeekInfo.choices,
        default=WeekInfo.MONDAY
    )

    next_week_interpretation = models.CharField(
        max_length=100,
        choices=WeekInfo.choices,
        default=WeekInfo.MONDAY
    )

    weekend_interpretation = models.CharField(
        max_length=100,
        choices=WeekInfo.choices,
        default=WeekInfo.SATURDAY
    )

    theme = models.CharField(
        max_length=20,
        choices=Theme.choices,
        default=Theme.DEFAULT
    )

    daily_task_number = models.PositiveSmallIntegerField(default=0)

    holiday = models.ManyToManyField(
        Week,
        blank=True
    )

    karma = models.BooleanField(_('Karma'), default=True)
    vacation_mode = models.BooleanField(_('Vacation Mode'), default=False)

    def __str__(self):
        name = self.target_user.auth0_name if self.target_user.auth0_name != '' else self.target_user.username
        return name + 'のmSetting'


class Project(TimeStampModel):

    # parent_project = models.ForeignKey(
    #     'self',
    #     on_delete=models.SET_NULL,
    #     blank=True,
    #     null=True,
    #     related_name='project_parent_project'
    # )

    member = models.ManyToManyField(
        mUser,
        blank=True
    )

    name = models.CharField(max_length=60)

    class Color(models.TextChoices):
        GREY = 'grey', _('Grey')
        RED = 'red', _('Red')
        BLUE = 'blue', _('Blue')
        GREEN = 'green', _('Green')
        YELLOW = 'yellow', _('Yellow')

    color = models.CharField(
        max_length=20,
        choices=Color.choices,
        default=Color.GREY
    )

    favorite = models.BooleanField(default=False)
    comment = models.TextField(null=True, blank=True)
    is_comp_public = models.BooleanField(default=False)
    deleted = models.BooleanField(default=False)
    archived = models.BooleanField(default=False)

    def __str__(self):
        return self.name


class ProjectMemberShip(TimeStampModel):

    invitee_user = models.ForeignKey(
        'api.mUser',
        on_delete=models.CASCADE,
        related_name='project_membership_invitee_user'
    )

    invited_user = models.ForeignKey(
        'api.mUser',
        on_delete=models.CASCADE,
        related_name='project_membership_invited_user'
    )

    target_project = models.ForeignKey(
        'api.Project',
        on_delete=models.CASCADE,
        related_name='project_membership_target_project'
    )

    accepted = models.BooleanField(default=False)

    def __str__(self):
        return self.invitee_user.username


class Section(TimeStampModel):

    target_project = models.ForeignKey(
        'api.Project',
        on_delete=models.CASCADE,
        related_name='section_target_project'
    )

    name = models.CharField(max_length=60)
    deleted = models.BooleanField(default=False)
    archived = models.BooleanField(default=False)

    def __str__(self):
        return self.name


class Task(TimeStampModel,
           TaskModel):

    target_user = models.ForeignKey(
        mUser,
        on_delete=models.CASCADE,
        related_name='task_target_user'
    )

    target_project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        related_name='task_target_project'
    )

    target_section = models.ForeignKey(
        Section,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name='task_target_section'
    )

    is_comp_sub_public = models.BooleanField(default=False)


class SubTask(TimeStampModel,
              TaskModel):

    target_task = models.ForeignKey(
        Task,
        on_delete=models.CASCADE,
        related_name='subtask_target_tast'
    )


class Label(TimeStampModel):

    target_task = models.ForeignKey(
        Task,
        on_delete=models.CASCADE,
        related_name='label_target_task'
    )

    name = models.CharField(max_length=60)

    def __str__(self):
        return self.name


class Karma(TimeStampModel):

    target_user = models.ForeignKey(
        mUser,
        on_delete=models.CASCADE,
        related_name='karma_target_user'
    )

    activity = models.CharField(max_length=100)
    point = models.PositiveSmallIntegerField()
