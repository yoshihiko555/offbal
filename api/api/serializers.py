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

    def create(self, validated_data):
        return mUser.objects.create(auth0_id=validated_data['auth0_id'], auth0_name=validated_data['auth0_name'])

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

    user_id = serializers.CharField(write_only=True)

    class Meta:
        model = Project
        fields = [
            'id',
            'parent_project',
            'member',
            'name',
            'color',
            'favorite',
            'comment',
            'is_comp_public',
            'deleted',
            'archived',
            'user_id',
        ]

    def create(self, validated_data):
        try:
            user = mUser.objects.get(auth0_id=validated_data['user_id'])
        except:
            logger.info('mUserが見つかりませんでした。')
            return None

        project = Project.objects.create(
                name = validated_data['name'],
                color = validated_data['color'],
                favorite = validated_data['favorite']
            )
        project.member.add(user)
        return project

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

    def create(self, validated_data):
        section = Section.objects.create(
                target_project = validated_data['target_project'],
                name = validated_data['name'],
            )
        return section

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
