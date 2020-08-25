from rest_framework import serializers
from .models import (
    mUser,
    Week,
    mSetting,
    Project,
    ProjectMemberShip,
    Section,
    Task,
    SubTask,
    Label,
    Karma,
)

import logging
import pytz
from datetime import (
    timezone,
    datetime,
    timedelta
)
from django.db.models import Q

logging.basicConfig(
    level = logging.DEBUG,
    format = '''%(levelname)s %(asctime)s %(pathname)s:%(funcName)s:%(lineno)s
    %(message)s''')

logger = logging.getLogger(__name__)


class DynamicFieldsModelSerializer(serializers.ModelSerializer):

    def __init__(self, *args, **kwargs):

        fields = kwargs.pop('fields', None)

        super(DynamicFieldsModelSerializer, self).__init__(*args, **kwargs)

        if fields is not None:
            allowed = set(fields)
            existing = set(self.fields)
            for field_name in existing - allowed:
                self.fields.pop(field_name)

class UserSerializer(DynamicFieldsModelSerializer):

    class Meta:
        model = mUser
        fields = [
            'auth0_id',
            'auth0_name',
#             'email',
            'address',
        ]

class SettingSerializer(DynamicFieldsModelSerializer):

    class Meta:
        model = mSetting
        fields = [
            'target_user',
            'language',
            'time_zone',
            'weekly_beginning',
            'next_week_interpretation',
            'weekend_interpretation',
            'theme',
            'daily_task_number',
            'holiday',
            'karma',
            'vacation_mode',
        ]

class ProjectSerializer(DynamicFieldsModelSerializer):

    class Meta:
        model = Project
        fields = [
            'parent_project',
            'member',
            'name',
            'color',
            'favorite',
            'comment',
            'is_comp_public',
            'deleted',
            'archived',
        ]

class ProjectMemberShipSerializer(DynamicFieldsModelSerializer):

    class Meta:
        model = ProjectMemberShip
        fields = [
            'invitee_user',
            'invited_user',
            'target_project',
            'accepted',
        ]

class SectionSerializer(DynamicFieldsModelSerializer):

    class Meta:
        model = Section
        fields = [
            'target_project',
            'name',
            'deleted',
            'archived',
        ]

class TaskSerializer(DynamicFieldsModelSerializer):

    class Meta:
        model = Task
        fields = [
            'target_user',
            'target_project',
            'target_section',
            'content',
            'label',
            'priority',
            'deadline',
            'remind',
            'comment',
            'completed',
            'deleted',
            'is_comp_sub_public'
        ]

class LabelSerializer(DynamicFieldsModelSerializer):

    class Meta:
        model = Label
        fields = [
            'target_task',
            'name'
        ]

class KarmaSerializer(DynamicFieldsModelSerializer):

    class Meta:
        model = Karma
        fields = [
            'target_user',
            'activity',
            'point'
        ]
