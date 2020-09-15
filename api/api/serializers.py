from rest_framework import serializers
from .models import (
    mUser,
    Week,
    mSetting,
    Category,
    mUserCategoryRelation,
    CategoryMemberShip,
    Section,
    Task,
    SubTask,
    Label,
    Karma,
    DefaultCategory,
)

import logging
import pytz
from datetime import (
    timezone,
    datetime,
    timedelta
)
from django.db.models import Q

from .utils import (
    utc_to_jst,
)

logging.basicConfig(
    level = logging.DEBUG,
    format = '''%(levelname)s %(asctime)s %(pathname)s:%(funcName)s:%(lineno)s
    %(message)s''')

logger = logging.getLogger(__name__)


class DynamicFieldsModelSerializer(serializers.ModelSerializer):

    def __init__(self, *args, **kwargs):
        fields = kwargs.pop('fields', None)

        # auth0_idを設定
        if 'context' in kwargs:
            self.auth0_id = kwargs['context']['view'].get_auth0_id()
            self.ordering_type = kwargs['context']['view'].get_ordering_type()
        else:
            self.auth0_id = None
            self.ordering_type = None

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

class CategorySerializer(DynamicFieldsModelSerializer):

    auth0_id = serializers.CharField(write_only=True)
    tasks = serializers.SerializerMethodField()
    complete_tasks = serializers.SerializerMethodField()
    sections = serializers.SerializerMethodField()
    favorite = serializers.SerializerMethodField()
    archived = serializers.SerializerMethodField()
    is_favorite = serializers.BooleanField(write_only=True, required=False)
    is_archived = serializers.BooleanField(write_only=True, required=False)

    # 画面側でのアイコン描画判定用 (カテゴリーかセクションか)
    isCategory = serializers.BooleanField(read_only=True, default=True)

    class Meta:
        model = Category
        fields = [
            'id',
            'creator',
            'member',
            'name',
            'color',
            'favorite',
            'comment',
            'is_comp_public',
            'deleted',
            'archived',
            'auth0_id',
            'tasks',
            'complete_tasks',
            'sections',
            'is_favorite',
            'is_archived',
            'isCategory',
            'index',
            'icon',
            'is_active',
        ]


    def get_favorite(self, obj):
        return obj.favorite.filter(auth0_id=self.auth0_id).exists()

    def get_archived(self, obj):
        return obj.archived.filter(auth0_id=self.auth0_id).exists()

    def get_tasks(self, obj):
        if hasattr(self, 'ordering_type') and self.ordering_type != None:
            return TaskSerializer(obj.task_target_category.all().filter(Q(target_section=None) & Q(completed=False)).order_by('-' + self.ordering_type), many=True).data
        else:
            return TaskSerializer(obj.task_target_category.all().filter(Q(target_section=None) & Q(completed=False)), many=True).data

    def get_complete_tasks(self, obj):
        if hasattr(self, 'ordering_type') and self.ordering_type != None:
            return TaskSerializer(obj.task_target_category.all().filter(Q(target_section=None) & Q(completed=True)).order_by('-' + self.ordering_type), many=True).data
        else:
            return TaskSerializer(obj.task_target_category.all().filter(Q(target_section=None) & Q(completed=True)).order_by('completed_at'), many=True).data

    def get_sections(self, obj):
        return SectionSerializer(obj.section_target_category.all(), many=True, context=self.context).data

    def create(self, validated_data):
        try:
            user = mUser.objects.get(auth0_id=validated_data['auth0_id'])
        except mUser.DoesNotExist:
            logger.info('mUserが見つかりませんでした。')
            return None

        category = Category.objects.create(
                creator=user,
                name = validated_data['name'],
                color = validated_data['color'],
                # favorite = validated_data['is_favorite']
            )

        if validated_data['is_favorite']:
            category.favorite.add(user)
        return category

    def update(self, instance, validated_data):
        try:
            user = mUser.objects.get(auth0_id=validated_data['auth0_id'])
        except mUser.DoesNotExist:
            logger.info('mUserが見つかりませんでした。')
            return None

        instance.name = validated_data['name']
        instance.color = validated_data['color']

        if 'is_favorite' in validated_data:
            if validated_data['is_favorite']:
                instance.favorite.add(user)
            else:
                instance.favorite.remove(user)

        if 'is_archived' in validated_data:
            if validated_data['is_archived']:
                instance.archived.add(user)
            else:
                instance.archived.remove(user)

        instance.save()
        return instance

class CategoryMemberShipSerializer(DynamicFieldsModelSerializer):

    class Meta:
        model = CategoryMemberShip
        fields = [
            'invitee_user',
            'invited_user',
            'target_category',
            'accepted',
        ]

class SectionSerializer(DynamicFieldsModelSerializer):

    tasks = serializers.SerializerMethodField()
    complete_tasks = serializers.SerializerMethodField()
    target_category_name = serializers.CharField(read_only=True, source='target_category.name')

    # 画面側でのアイコン描画判定用 (カテゴリーかセクションか)
    isCategory = serializers.BooleanField(read_only=True, default=False)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    class Meta:
        model = Section
        fields = [
            'id',
            'target_category',
            'name',
            'deleted',
            'archived',
            'tasks',
            'complete_tasks',
            'isCategory',
            'target_category_name',
        ]

    def get_tasks(self, obj):
        if hasattr(self, 'ordering_type') and self.ordering_type != None:
            return TaskSerializer(obj.task_target_section.all().filter(Q(completed=False)).order_by('-' + self.ordering_type), many=True).data
        else:
            return TaskSerializer(obj.task_target_section.all().filter(Q(completed=False)), many=True).data

    def get_complete_tasks(self, obj):
        if hasattr(self, 'ordering_type') and self.ordering_type != None:
            return TaskSerializer(obj.task_target_section.all().filter(Q(completed=True)).order_by('-' + self.ordering_type), many=True).data
        else:
            return TaskSerializer(obj.task_target_section.all().filter(Q(completed=True)), many=True).data

    def create(self, validated_data):
        section = Section.objects.create(
                target_category = validated_data['target_category'],
                name = validated_data['name'],
            )
        return section

class TaskSerializer(DynamicFieldsModelSerializer):
    """
    - タスクデータ作成用パラメータ
        auth0_id : ユーザーID (必須)
        content : タスク内容 (必須)
        comment : コメント (必須,空でもok)
        category_id ： カテゴリーのid (必須)
        section_id : セクションのid (必須) ※指定無しの場合0
        deadline_str : 有効期限の文字列 (必須,空でもok) [%Y-%m-%d %H:%M:%S]
        remind_str : リマインダーの文字列 (必須,空でもok) [%Y-%m-%d %H:%M:%S]
        label_list : ラベルidのリスト (必須,空でもok)
        priority : 優先度の文字列 (必須) [1~5]

            ※カテゴリー, セクション指定の際
                1. カテゴリーidとセクションidが0の場合インボックスに作成
                2. 「カテゴリー」 にタスク追加時はカテゴリーidのみ指定すればok
                3. 「セクション」 にタスク追加時はセクションidのみ指定すればok
    """

    auth0_id = serializers.CharField(write_only=True)

    category_id = serializers.IntegerField(write_only=True)
    section_id = serializers.IntegerField(write_only=True)
    deadline_str = serializers.CharField(write_only=True, allow_blank=True)
    remind_str = serializers.CharField(write_only=True, allow_blank=True)
    label_list = serializers.ListField(
        child=serializers.IntegerField(),
        allow_empty=True,
        write_only=True,
    )
    start_time_str = serializers.CharField(write_only=True, allow_blank=True)

    target_user = serializers.CharField(read_only=True)
    target_category = serializers.ReadOnlyField(source='target_category.id')
    target_category_name = serializers.CharField(read_only=True, source='target_category.name')
    target_section = serializers.ReadOnlyField(source='target_section.id', default=0)
    target_section_name = serializers.CharField(read_only=True, source='target_section.name', default='')
    label = serializers.SerializerMethodField()
    start_time = serializers.SerializerMethodField()
    deadline = serializers.SerializerMethodField()
    remind = serializers.SerializerMethodField()
    created_at = serializers.SerializerMethodField()
    updated_at = serializers.SerializerMethodField()

    # サブタスク全部（表示に使用)
    sub_tasks = serializers.SerializerMethodField()

    # 完了したサブタスクのpkリスト（完了数カウント,チェックボックスの初期描画に使用）
    complete_sub_tasks = serializers.SerializerMethodField()
    completed_at = serializers.SerializerMethodField()

    class Meta:
        model = Task
        fields = [
            'id',
            'target_user',
            'target_category',
            'target_category_name',
            'target_section',
            'target_section_name',
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
            'category_id',
            'section_id',
            'deadline_str',
            'remind_str',
            'label_list',
            'created_at',
            'updated_at',
            'sub_tasks',
            'complete_sub_tasks',
            'completed_at',
            'start_time',
            'start_time_str',
        ]

    def get_label(self, obj):
        return LabelSerializer(obj.label.all(), many=True).data

    def get_start_time(self, obj):
        if obj.start_time == None:
            return ''
        return utc_to_jst(obj.start_time)

    def get_deadline(self, obj):
        if obj.deadline == None:
            return ''
        return utc_to_jst(obj.deadline)

    def get_remind(self, obj):
        if obj.remind == None:
            return ''
        return utc_to_jst(obj.remind)

    def get_created_at(self, obj):
        return utc_to_jst(obj.created_at)

    def get_updated_at(self, obj):
        return utc_to_jst(obj.updated_at)

    def get_completed_at(self, obj):
        if obj.completed_at == None:
            return ''
        return utc_to_jst(obj.completed_at)

    def get_sub_tasks(self, obj):
        return SubTaskSerializer(obj.subtask_target_task.all(), many=True).data

    def get_complete_sub_tasks(self, obj):
        complete_sub_tasks = obj.subtask_target_task.all().filter(completed=True)
        return [subtask.pk for subtask in complete_sub_tasks]

    def create(self, validated_data):

        logger.debug('============TASKを作る================')
        logger.debug(validated_data)

        category_id = validated_data['category_id']
        section_id = validated_data['section_id']

        try:
            user = mUser.objects.get(auth0_id=validated_data['auth0_id'])
            section = Section.objects.get(id=section_id) if section_id != 0 else None
            if section != None:
                category = section.target_category
            category = Category.objects.get(id=category_id) if category_id != 0 else Category.objects.get(name='インボックス', creator=user)

        except mUser.DoesNotExist:
            logger.error('mUserが見つかりませんでした。')
            return None
        except Category.DoesNotExist:
            logger.error('Categoryが見つかりませんでした。')
            return None
        except Section.DoesNotExist:
            logger.error('Sectionが見つかりませんでした。')
            return None

        st_str = validated_data['start_time_str']
        dl_str = validated_data['deadline_str']
        rm_str = validated_data['remind_str']

        start_time = datetime.strptime(st_str, '%Y-%m-%d %H:%M:%S') if st_str != '' else None
        deadline = datetime.strptime(dl_str, '%Y-%m-%d %H:%M:%S') if dl_str != '' else None
        remind = datetime.strptime(rm_str, '%Y-%m-%d %H:%M:%S') if rm_str != '' else None

        task = Task.objects.create(
            content=validated_data['content'],
            comment=validated_data['comment'],
            target_user=user,
            target_category=category,
            target_section=section,
            priority=validated_data['priority'],
            start_time=start_time,
            deadline=deadline,
            remind=remind,
        )

        for pk in validated_data['label_list']:
            try:
                label = Label.objects.get(pk=pk)
                task.label.add(label)
            except Label.DoesNotExist:
                logger.error('Labelが見つかりませんでした。')
                return

        return task

    def update(self, instance, validated_data):

        category_id = validated_data['category_id']
        section_id = validated_data['section_id']

        try:
            user = mUser.objects.get(auth0_id=validated_data['auth0_id'])
            section = Section.objects.get(id=section_id) if section_id != 0 else None
            if section != None:
                category = section.target_category
            category = Category.objects.get(id=category_id) if category_id != 0 else Category.objects.get(name='インボックス', creator=user)

            instance.target_category = category
            instance.target_section = section

        except mUser.DoesNotExist:
            logger.error('mUserが見つかりませんでした。')
            return None
        except Category.DoesNotExist:
            logger.error('Categoryが見つかりませんでした。')
            return None
        except Section.DoesNotExist:
            logger.error('Sectionが見つかりませんでした。')
            return None

        st_str = validated_data['start_time_str']
        dl_str = validated_data['deadline_str']
        rm_str = validated_data['remind_str']

        start_time = datetime.strptime(st_str, '%Y-%m-%d %H:%M:%S') if st_str != '' else None
        deadline = datetime.strptime(dl_str, '%Y-%m-%d %H:%M:%S') if dl_str != '' else None
        remind = datetime.strptime(rm_str, '%Y-%m-%d %H:%M:%S') if rm_str != '' else None

        instance.content = validated_data['content']
        instance.comment = validated_data['comment']
        instance.priority = validated_data['priority']
        instance.start_time = start_time
        instance.deadline = deadline
        instance.remind = remind

        instance.label.clear()
        for pk in validated_data['label_list']:
            try:
                label = Label.objects.get(pk=pk)
                instance.label.add(label)
            except Label.DoesNotExist:
                logger.error('Labelが見つかりませんでした。')
                return

        instance.save()
        return instance

class SubTaskSerializer(DynamicFieldsModelSerializer):

    created_at = serializers.SerializerMethodField()
    updated_at = serializers.SerializerMethodField()
    completed_at = serializers.SerializerMethodField()

    class Meta:
        model = SubTask
        fields = [
            'id',
            'target_task',
            'content',
            'completed',
            'completed_at',
            'created_at',
            'updated_at',
        ]

    def get_created_at(self, obj):
        return utc_to_jst(obj.created_at)

    def get_updated_at(self, obj):
        return utc_to_jst(obj.updated_at)

    def get_completed_at(self, obj):
        if obj.completed_at == None:
            return ''
        return utc_to_jst(obj.completed_at)

    def create(self, validated_data):
        logger.debug("サブタスクを作る")
        logger.debug(validated_data)

        content = validated_data['content']

        try:
            task = Task.objects.get(pk=validated_data['target_task'])
        except Task.DoesNotExist:
            logger.error('タスクが見つかりませんでした。')
            return

        subTask = SubTask.objects.create(
            target_task=task,
            content=content
        )

        return subTask


class LabelSerializer(DynamicFieldsModelSerializer):

    auth0_id = serializers.CharField(write_only=True)
    author = serializers.CharField(read_only=True)
    created_at = serializers.SerializerMethodField()
    updated_at = serializers.SerializerMethodField()

    class Meta:
        model = Label
        fields = [
            'id',
            'name',
            'author',
            'auth0_id',
            'created_at',
            'updated_at',
        ]

    def get_created_at(self, obj):
        return utc_to_jst(obj.created_at)

    def get_updated_at(self, obj):
        return utc_to_jst(obj.updated_at)


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

    created_at = serializers.SerializerMethodField()
    updated_at = serializers.SerializerMethodField()

    class Meta:
        model = Karma
        fields = [
            'target_user',
            'activity',
            'point',
            'created_at',
            'updated_at',
        ]

    def get_created_at(self, obj):
        return utc_to_jst(obj.created_at)

    def get_updated_at(self, obj):
        return utc_to_jst(obj.updated_at)


class DefaultCategorySerializer(DynamicFieldsModelSerializer):
    class Meta:
        model = DefaultCategory
        fields = '__all__'


