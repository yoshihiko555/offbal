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

#     auth0_id = serializers.CharField(write_only=True)
    tasks = serializers.SerializerMethodField()
    sections = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = [
            'id',
            'member',
            'name',
            'color',
            'favorite',
            'comment',
            'is_comp_public',
            'deleted',
            'archived',
#             'auth0_id',
            'tasks',
            'sections',
        ]

    def get_tasks(self, obj):
        return TaskSerializer(obj.task_target_project.all(), many=True).data

    def get_sections(self, obj):
        return SectionSerializer(obj.section_target_project.all(), many=True).data

    def create(self, validated_data):
#         try:
#             user = mUser.objects.get(auth0_id=validated_data['auth0_id'])
#         except:
#             logger.info('mUserが見つかりませんでした。')
#             return None

        project = Project.objects.create(
                name = validated_data['name'],
                color = validated_data['color'],
                favorite = validated_data['favorite']
            )
        # project.member.add(user)
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

    tasks = serializers.SerializerMethodField()

    class Meta:
        model = Section
        fields = [
            'id',
            'target_project',
            'name',
            'deleted',
            'archived',
            'tasks',
        ]

    def get_tasks(self, obj):
        return TaskSerializer(obj.task_target_section.all(), many=True).data

    def create(self, validated_data):
        section = Section.objects.create(
                target_project = validated_data['target_project'],
                name = validated_data['name'],
            )
        return section

class TaskSerializer(DynamicFieldsModelSerializer):

    auth0_id = serializers.CharField(write_only=True)
    project_name = serializers.CharField(write_only=True)
    deadline_str = serializers.CharField(write_only=True, allow_blank=True)
    remind_str = serializers.CharField(write_only=True, allow_blank=True)
    label_list = serializers.ListField(
        child=serializers.CharField(),
        allow_empty=True,
        write_only=True,
    )
    section_name = serializers.CharField(write_only=True, allow_blank=True)

    target_user = serializers.CharField(read_only=True)
    target_project = serializers.CharField(read_only=True)
    label = serializers.CharField(read_only=True)

    class Meta:
        model = Task
        fields = [
            'id',
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
            'is_comp_sub_public',
            'auth0_id',
            'project_name',
            'deadline_str',
            'remind_str',
            'label_list',
            'section_name',
        ]

    def create(self, validated_data):

        logger.debug('============TASKを作る================')
        logger.debug(validated_data)

        try:
            user = mUser.objects.get(auth0_id=validated_data['auth0_id'])
            project = Project.objects.get(name=validated_data['project_name'])

            section_name = validated_data['section_name']
            section = Section.objects.get(name=section_name) if section_name != '' else None

        except mUser.DoesNotExist:
            logger.error('mUserが見つかりませんでした。')
            return None
        except Project.DoesNotExist:
            logger.error('Projectが見つかりませんでした。')
            return None
        except Section.DoesNotExist:
            logger.error('Sectionが見つかりませんでした。')
            return None

        dl_str = validated_data['deadline_str']
        rm_str = validated_data['remind_str']

        deadline = datetime.strptime(dl_str, '%Y-%m-%d %H:%M:%S') if dl_str != '' else None
        remind = datetime.strptime(rm_str, '%Y-%m-%d %H:%M:%S') if rm_str != '' else None

        task = Task.objects.create(
            content=validated_data['content'],
            comment=validated_data['comment'],
            target_user=user,
            target_project=project,
            target_section=section,
            priority=validated_data['priority'],
            deadline=deadline,
            remind=remind,
        )

        for label_name in validated_data['label_list']:
            try:
                label = Label.objects.get(name=label_name)
                task.label.add(label)
            except Label.DoesNotExist:
                logger.error('Labelが見つかりませんでした。')
                return None

        return task

class LabelSerializer(DynamicFieldsModelSerializer):

    auth0_id = serializers.CharField(write_only=True)
    author = serializers.CharField(read_only=True)

    class Meta:
        model = Label
        fields = [
            'name',
            'author',
            'auth0_id'
        ]

    def create(self, validated_data):

        try:
            user = mUser.objects.get(auth0_id=validated_data['auth0_id'])
        except mUser.DoesNotExist:
            logger.info('mUserが見つかりませんでした')
            return None

        label = Label.objects.create(
            name=validated_data['name'],
            author=user
        )

        return label

class KarmaSerializer(DynamicFieldsModelSerializer):

    class Meta:
        model = Karma
        fields = [
            'target_user',
            'activity',
            'point'
        ]
