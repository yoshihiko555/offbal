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

    def _create_user(self, username, email, password, **extra_fields):

        if not username:
            raise ValueError('ユーザーネームは必須項目です。')

        email = self.normalize_email(email)
        username = self.model.normalize_username(username)
        user = self.model(username=username, email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)

        mSetting.objects.create(
            target_user=user
        )
        # category = Category.objects.create(
        #     creator=user,
        #     name='インボックス'
        # )
        # category.member.add(user)

        return user

    def create_user(self, username, email, password=None, **extra_fields):

        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)

        return self._create_user(username, email, password, **extra_fields)

    def create_superuser(self, username, email=None, password=None, **extra_fields):

        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self._create_user(username, email, password, **extra_fields)



class mUser(AbstractBaseUser,
            PermissionsMixin,
            TimeStampModel):

    auth0_id = models.CharField(_('Auth0Id'), max_length=255, unique=True)
    auth0_name = models.CharField(_('Auth0Name'), max_length=255, unique=False)
    username = models.CharField(_('Username'), max_length=70, unique=True, blank=True, null=True)
    email = models.EmailField(_('Email'), max_length=70, unique=True)
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
    EMAIL_FIELD = 'email'
    REQUIRED_FIELDS = ['email']

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
        HONOLULU = 'Pacific/Honolulu', _('(UTC-10:00) ハワイ')
        ANCHORAGE = 'America/Anchorage', _('(UTC-09:00) アラスカ')
        LOS_ANGELES = 'America/Los_Angeles', _('(UTC-08:00) 太平洋標準時(米国およびカナダ)')
        PHOENIX = 'America/Phoenix', _('(UTC-07:00) アリゾナ')
        CHICAGO = 'America/Chicago', _('(UTC-06:00) 中部標準時(米国およびカナダ)')
        NEW_YORK = 'America/New_York', _('(UTC-05:00) 東部標準時(米国およびカナダ)')
        HALIFAX = 'America/Halifax', _('(UTC-04:00) 大西洋標準時(カナダ)')
        BUENOS_AIRES = 'America/Argentina/Buenos_Aires', _('(UTC-03:00) ブエノスアイレス')
        GMT2 = 'Etc/GMT+2', _('(UTC-02:00) 協定世界時-2')
        CAPE_VERDE = 'Atlantic/Cape_Verde', _('(UTC-01:00) カーボベルデ諸島')
        LONDON = 'Europe/London', _('(UTC+00:00) ロンドン')
        BERLIN = 'Europe/Berlin', _('(UTC+01:00) ベルリン、ローマ')
        ISTANBUL = 'Europe/Istanbul', _('(UTC+02:00) アテネ、ブカレスト')
        NAIROBI = 'Africa/Nairobi', _('(UTC+03:00) ナイロビ')
        MASCOW = 'Europe/Moscow', _('(UTC+04:00) モスクワ、サンクトペテルブルグ')
        TASHKENT = 'Asia/Tashkent', _('(UTC+05:00) タシケント')
        ALMATY = 'Asia/Almaty', _('(UTC+06:00) アスタナ')
        BANGKOK = 'Asia/Bangkok', _('(UTC+07:00) バンコク、ハノイ、ジャカルタ')
        SHANGHAI = 'Asia/Shanghai', _('(UTC+08:00) 北京、重慶、香港、ウルムチ')
        TOKYO = 'Asia/Tokyo', _('(UTC+09:00) 大阪、札幌、東京')
        HABART = 'Australia/Hobart', _('(UTC+10:00) ホバート')
        GUADALCANAL = 'Pacific/Guadalcanal', _('(UTC+11:00) ソロモン諸島')
        FIJI = 'Pacific/Fiji', _('(UTC+12:00) フィジー、マーシャル諸島')
        APIA = 'Pacific/Apia', _('(UTC+13:00) サモア')


    class Theme(models.TextChoices):
        DEFAULT = 'default', _('Default')
        DARK = 'dark', _('Dark')

    class TimeFormat(models.IntegerChoices):
        NORMAL = 0, _('Normal')
        AM_PM = 1, _('AM or PM')

    target_user = models.OneToOneField(
        mUser,
        on_delete=models.CASCADE,
        related_name='setting_target_user'
    )

    language = models.CharField(
        max_length=30,
        choices=Language.choices,
        default=Language.JAPANESE
    )

    start_page = models.CharField(
        max_length=50,
        default='today',
    )

    time_zone = models.CharField(
        max_length=50,
        choices=Timezone.choices,
        default=Timezone.TOKYO
    )

    time_format = models.IntegerField(
        choices=TimeFormat.choices,
        default=TimeFormat.NORMAL,
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

    daily_task_number = models.PositiveSmallIntegerField(default=5)

    holiday = models.ManyToManyField(
        Week,
        blank=True
    )

    karma = models.BooleanField(_('Karma'), default=True)
    vacation_mode = models.BooleanField(_('Vacation Mode'), default=False)

    mail_today_result = models.BooleanField(_('Mail Today Result'), default=True)
    mail_news = models.BooleanField(_('Mail News'), default=True)
    mail_hint = models.BooleanField(_('Mail Hint'), default=True)

    is_multiple_filter = models.BooleanField(_('Is Multiple Filter'), default=False)


    def __str__(self):
        name = self.target_user.auth0_name if self.target_user.auth0_name != '' else self.target_user.username
        return name + 'のmSetting'


class DefaultCategory(models.Model):

    class Name(models.TextChoices):
        WORK = 'work', _('Work')
        SLEEP = 'sleep', _('Sleep')
        FAMILY = 'family', _('Family')
        MOTION = 'motion', _('Motion')
        FRIEND = 'friend',_('Friend')
        LOVE = 'love', _('Love')
        HEALTH = 'health', _('Health')
        HOBBY = 'hobby', _('Hobby')

    name = models.CharField(
        max_length=60,
        choices=Name.choices,
        default=Name.WORK
    )

    class Color(models.TextChoices):
        GREY = 'grey', _('Grey')
        RED = 'red', _('Red')
        BLUE = 'blue', _('Blue')
        GREEN = 'green', _('Green')
        YELLOW = 'yellow', _('Yellow')
        ORANGE = 'orange', _('Orange')
        PINK = 'pink', _('Pink')
        TEAL = 'teal', _('Teal')
        CYAN = 'cyan', _('Cyan')

    color = models.CharField(
        max_length=20,
        choices=Color.choices,
        default=Color.GREY
    )

    class Icon(models.TextChoices):
        WORK = 'mdi-briefcase-outline', _('Work')
        SLEEP = 'mdi-sleep', _('Sleep')
        FAMILY = 'mdi-home-heart', _('Family')
        MOTION = 'mdi-run', _('Motion')
        FRIEND = 'mdi-account-group',_('Friend')
        LOVE = 'mdi-account-heart-outline', _('Love')
        HEALTH = 'mdi-bottle-tonic-plus-outline', _('Health')
        HOBBY = 'mdi-gamepad-variant-outline', _('Hobby')

    icon = models.CharField(
        max_length=100,
        choices=Icon.choices,
        default=Icon.WORK,
    )

    message = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Category(TimeStampModel):

    creator = models.ForeignKey(
        mUser,
        on_delete=models.CASCADE,
        related_name='category_creator_user'
    )

    member = models.ManyToManyField(
        mUser,
        through='mUserCategoryRelation',
        related_name='category_member',
        blank=True
    )

    name = models.CharField(max_length=60)

    class Color(models.TextChoices):
        GREY = 'grey', _('Grey')
        RED = 'red', _('Red')
        BLUE = 'blue', _('Blue')
        GREEN = 'green', _('Green')
        YELLOW = 'yellow', _('Yellow')
        ORANGE = 'orange', _('Orange')
        PINK = 'pink', _('Pink')
        TEAL = 'teal', _('Teal')
        CYAN = 'cyan', _('Cyan')

    color = models.CharField(
        max_length=20,
        choices=Color.choices,
        default=Color.GREY
    )

    class Icon(models.TextChoices):
        WORK = 'mdi-briefcase-outline', _('Grey')
        SLEEP = 'mdi-sleep', _('Sleep')
        FAMILY = 'mdi-home-heart', _('Family')
        MOTION = 'mdi-run', _('Motion')
        FRIEND = 'mdi-account-group',_('Friend')
        LOVE = 'mdi-account-heart-outline', _('Love')
        HEALTH = 'mdi-bottle-tonic-plus-outline', _('Health')
        HOBBY = 'mdi-gamepad-variant-outline', _('Hobby')

    icon = models.CharField(
        max_length=100,
        choices=Icon.choices,
        default=Icon.WORK,
    )

    # favorite = models.BooleanField(default=False)
    favorite = models.ManyToManyField(
        mUser,
        related_name='favorite_user',
        blank=True,
    )
    comment = models.TextField(null=True, blank=True)
    is_comp_public = models.BooleanField(default=False)
    deleted = models.BooleanField(default=False)
    # archived = models.BooleanField(default=False)
    archived = models.ManyToManyField(
        mUser,
        related_name='archived_user',
        blank=True,
    )
    index = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.creator.auth0_name + 'の' + self.name

# TODO 不要モデル
class mUserCategoryRelation(models.Model):
    user = models.ForeignKey(
        mUser,
        on_delete=models.CASCADE,
    )
    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
    )
    index = models.IntegerField(default=1)

    def __str__(self):
        return self.user.auth0_name + 'の' + self.category.name


class CategoryMemberShip(TimeStampModel):

    invitee_user = models.ForeignKey(
        'api.mUser',
        on_delete=models.CASCADE,
        related_name='category_membership_invitee_user'
    )

    invited_user = models.ForeignKey(
        'api.mUser',
        on_delete=models.CASCADE,
        related_name='category_membership_invited_user'
    )

    target_category = models.ForeignKey(
        'api.Category',
        on_delete=models.CASCADE,
        related_name='category_membership_target_category'
    )

    accepted = models.BooleanField(default=False)

    def __str__(self):
        return self.invitee_user.username


class Task(TimeStampModel,
           TaskModel):

    target_user = models.ForeignKey(
        mUser,
        on_delete=models.CASCADE,
        related_name='task_target_user'
    )

    target_category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        related_name='task_target_category'
    )

    is_comp_sub_public = models.BooleanField(default=False)

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


class SubTask(TimeStampModel,
              TaskModel):

    target_task = models.ForeignKey(
        Task,
        on_delete=models.CASCADE,
        related_name='subtask_target_task'
    )


class Label(TimeStampModel):

    name = models.CharField(max_length=20)

    author = models.ForeignKey(
        'api.mUser',
        on_delete=models.CASCADE,
    )

    def __str__(self):
        return self.name


class Karma(TimeStampModel):

    target_user = models.ForeignKey(
        mUser,
        on_delete=models.CASCADE,
        related_name='karma_target_user'
    )

    activity_type = models.PositiveSmallIntegerField()
    activity = models.CharField(max_length=100)
    point = models.IntegerField()

    def __str__(self):
        return self.target_user.auth0_name + 'の' + self.activity
