from rest_framework import (
    generics,
    permissions,
    authentication,
    status,
    viewsets,
    filters
)
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Sum, Q

from .serializers import (
    UserSerializer,
    SettingSerializer,
    CategorySerializer,
    CategoryMemberShipSerializer,
    TaskSerializer,
    SubTaskSerializer,
    LabelSerializer,
    KarmaSerializer
)
from .models import (
    mUser,
    Week,
    mSetting,
    Category,
    mUserCategoryRelation,
    CategoryMemberShip,
    Task,
    SubTask,
    Label,
    Karma,
)

from django.utils import timezone
from datetime import date, datetime, timedelta

from .filters import (
    CategoryFilter,
    KarmaFilter,
)

from .mixins import (
    GetLoginUserMixin,
    CreateKarmaMixin,
)

from .utils import (
    ReturnDateTime,
)

from dateutil.relativedelta import relativedelta

import logging
import requests
import urllib
logger = logging.getLogger(__name__)


class BaseModelViewSet(viewsets.ModelViewSet, GetLoginUserMixin, CreateKarmaMixin):

    def list(self, request, *args, **kwargs):
        self.set_auth0_id(request)
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class UserViewSet(BaseModelViewSet):

    permission_classes = (permissions.IsAuthenticated,)
    queryset = mUser.objects.all()
    serializer_class = UserSerializer
    lookup_field = 'auth0_id'

    def list(self, request, *args, **kwargs):
        logger.debug('=======================USER VIEW SET=====================')
        return super().list(request, *args, **kwargs)


class CategoryViewSet(BaseModelViewSet):

    permission_classes = (permissions.IsAuthenticated,)
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    filter_class = CategoryFilter

    def create(self, request, *args, **kwargs):
        self.auth0_id = request.data['auth0_id']
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            self.perform_create(serializer)
            try:
                user = mUser.objects.get(auth0_id=request.data['auth0_id'])
                mUserCategoryRelation.objects.create(
                    user=user,
                    category=serializer.instance,
                    index=self.autoincrement(user),
                )

            except mUser.DoesNotExist:
                logger.error('mUserが見つかりませんでした。')
                return Response(status=status.HTTP_400_BAD_REQUEST)
            except Category.DoesNotExist:
                logger.error('Categoryが見つかりませんでした。')
                return Response(status=status.HTTP_400_BAD_REQUEST)

            return Response(self.get_serializer(serializer.instance).data, status=status.HTTP_201_CREATED)

        logger.debug(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, pk=None):
        self.auth0_id = request.data['auth0_id']
        queryset = self.queryset.get(pk=pk)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data)
        if serializer.is_valid():
            self.perform_update(serializer)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, pk=None):
        self.auth0_id = request.query_params['auth0_id']
        user = mUser.objects.get(auth0_id=request.query_params['auth0_id'])
        try:
            detail_category = user.category_creator_user.get(name=pk)
            serializer = self.get_serializer(detail_category)
        except Category.DoesNotExist:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(serializer.data, status=status.HTTP_200_OK)



    @action(methods=['GET'], detail=False)
    def checkCategoryDuplication(self, request):
        '''
        カテゴリー作成時のカテゴリー名重複チェック
        '''
        auth0_id = request.query_params['auth0_id']
        name = request.query_params['name']
        try:
            user = mUser.objects.get(auth0_id=auth0_id)
            user_category = user.category_member.all()
            user_category.get(name=name)
        except Category.DoesNotExist:
            return Response({'status': 'success', 'result': True}, status=status.HTTP_200_OK)
        else:
            return Response({'status': 'success', 'result': False}, status=status.HTTP_200_OK)

    @action(methods=['GET'], detail=False)
    def checkUpdateCategoryDuplication(self, request):
        '''
        カテゴリー更新時のカテゴリー名重複チェック
        '''
        auth0_id = request.query_params['auth0_id']
        current_name = request.query_params['current_name']
        new_name = request.query_params['new_name']

        user = mUser.objects.get(auth0_id=auth0_id)
        user_category = user.category_member.all()
        # 現在のカテゴリー名以外のカテゴリーを取得
        filter_category = user_category.exclude(name=current_name)
        if filter_category.filter(name=new_name).count() == 0:
            # 重複するカテゴリー名が存在しない
            return Response({'status': 'success', 'result': True}, status=status.HTTP_200_OK)
        return Response({'status': 'success', 'result': False}, status=status.HTTP_200_OK)

    @action(methods=['PUT'], detail=False)
    def update_category_index(self, request, pk=None):
        '''
        カテゴリーのDADでの並び替えアクション
        '''
        self.auth0_id = request.data['auth0_id']
        user = mUser.objects.get(auth0_id=request.data['auth0_id'])
        categories = []
        for i, category in enumerate(request.data['categories'], 1):
            cate = Category.objects.get(pk=category['id'])
            cate.index = i
            categories.append(cate)

        Category.objects.bulk_update(categories, fields=['index'])
        user_category = user.category_creator_user.filter(is_active=True).order_by('index')
        serializer = self.get_serializer(user_category, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(methods=['GET'], detail=True)
    def order_tasks(self, request, pk=None):
        '''
        並び替えボタンでのタスク並び替えアクション
        '''
        self.set_ordering_type(request)
        category = Category.objects.get(pk=pk)
        serializer = self.get_serializer(category)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(methods=['PUT'], detail=False)
    def change_categories(self, request, pk=None):
        '''
        カテゴリー切り替え時のアクション

        **レコード登録**
            選択されたカテゴリーの中でユーザーに紐付かないカテゴリーが存在すれば作成する

        **レコード更新**
            選択されなかったカテゴリーは有効フラグを折る

        **リクエストデータ**
            - auth0_id : ログイン中のユーザーID
            - categories : 選択されたカテゴリー一覧
        '''

        # ユーザー情報を取得
        self.auth0_id = request.data['auth0_id']
        user = mUser.objects.get(auth0_id=request.data['auth0_id'])
        user_categories = user.category_creator_user.all()

        # ユーザーにまだ紐づいていないカテゴリーを作成する処理
        create_categories = []
        for category in request.data['categories']:
            if not user_categories.filter(name=category['name']).exists():
                create_categories.append(Category(
                    creator=user,
                    name=category['name'],
                    color=category['color'],
                    icon=category['icon'],
                    index=self.autoincrement(user)
                ))
        logger.info('追加で作成するカテゴリー')
        logger.info(create_categories)
        Category.objects.bulk_create(create_categories)

        # カテゴリーのis_activeを更新
        update_categories = []
        for user_category in user_categories:
            active_flg = False
            for category in request.data['categories']:
                if user_category.name == category['name']:
                    # 選択されたカテゴリーなので有効フラグをTrueに変更
                    active_flg = True
                    break

            user_category.is_active = active_flg
            update_categories.append(user_category)

        Category.objects.bulk_update(update_categories, fields=['is_active'])
        res = user_categories.filter(is_active=True).order_by('index')
        serializer = self.get_serializer(res, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


    def autoincrement(self, user):
        '''
        対象ユーザーが関与するカテゴリー総数 + 1を返却する
        '''
        res = user.category_creator_user.all().count() + 1
        return res

class TaskViewSet(BaseModelViewSet):

    permission_classes = (permissions.IsAuthenticated,)
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            self.perform_create(serializer)
            user = mUser.objects.get(auth0_id=request.data['auth0_id'])
            self.create_karma(user, self.ADD_TASK)
            return Response(self.get_serializer(serializer.instance).data, status=status.HTTP_201_CREATED)

        logger.debug(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        data = self.get_serializer(instance).data
        self.perform_destroy(instance)
        return Response(data, status=status.HTTP_200_OK)

    @action(methods=['PUT'], detail=False)
    def complete(self, request):
        """
        該当タスクの完了フラグを立てるアクション
            単体:
                key: complete_task
                value: 該当タスクの
            複数:
                key: complete_task_list
                value: 該当タスクのリスト
        """
        if 'complete_task' in request.data:
            complete_task = request.data['complete_task']
            try:
                task = Task.objects.get(pk=complete_task['id'])
                task.completed = True if task.completed == False else False
                task.completed_at = timezone.datetime.now()
                task.save()
            except Task.DoesNotExist:
                logger.error('タスクが見つかりませんでした。')
                return Response(status=status.HTTP_400_BAD_REQUEST)
            return Response(self.get_serializer(task).data, status=status.HTTP_200_OK)

        else:
            complete_task_list = request.data['complete_task_list']
            completed = request.data['completed']
            complete_tasks = []
            try:
                for complete_task in complete_task_list:
                    instance = Task.objects.get(pk=complete_task['id'])
                    instance.completed = True if bool(completed) else False
                    instance.completed_at = timezone.datetime.now() if bool(completed) else None
                    complete_tasks.append(instance)
                Task.objects.bulk_update(complete_tasks, ['completed', 'completed_at'])
            except Task.DoesNotExist:
                logger.error('タスクが見つかりませんでした。')
                return Response(status=status.HTTP_400_BAD_REQUEST)
            return Response(self.get_serializer(complete_tasks, many=True).data, status=status.HTTP_200_OK)

    @action(methods=['PUT'], detail=False)
    def change_task_detail(self, request):
        """
        タスク詳細から個別にデータを更新するアクション
        """
        params = {
            'content': self.changeTaskDetail,
            'comment': self.changeTaskDetail,
            'start_time': self.changeTaskDetail,
            'deadline': self.changeTaskDetail,
            'remind': self.changeTaskDetail,
            'priority': self.changeTaskDetail,
        }

        for value in params:
            if value in request.data:
                return params[value](key=value, data=request.data)

        return Response(status=status.HTTP_400_BAD_REQUEST)

    def changeTaskDetail(self, key, data):
        try:
            task = Task.objects.get(pk=data['task_id'])
            if key == 'content': task.content = data['content']
            elif key == 'comment': task.comment = data['comment']
            elif key == 'start_time': task.start_time = datetime.strptime(data['start_time'], '%Y-%m-%d %H:%M:%S')
            elif key == 'deadline': task.deadline = datetime.strptime(data['deadline'], '%Y-%m-%d %H:%M:%S')
            elif key == 'remind': task.remind = datetime.strptime(data['remind'], '%Y-%m-%d %H:%M:%S')
            elif key == 'priority': task.priority = data['priority']
            task.save()
        except Task.DoesNotExist:
            logger.error('タスクが見つかりませんでした。')
            return Response(status=status.HTTP_400_BAD_REQUEST)
        logger.debug(task)
        return Response(self.get_serializer(task).data, status=status.HTTP_200_OK)


    @action(methods=['GET'], detail=False)
    def get_info(self, request):
        '''
        現在のタスク情報を返却するアクション
        '''
        user = mUser.objects.get(auth0_id=request.query_params['auth0_id'])
        user_tasks = user.task_target_user.all()

        # 1日の最大タスク量を取得
        setting = mSetting.objects.get(target_user=user)
        daily_task_number = setting.daily_task_number

        # 今日の完了タスク数を取得
        today_comp_task_count = user_tasks.filter(completed=True, completed_at__date=date.today()).count()

        # 現在の未完了タスク数を取得
        incomp_task_count = user_tasks.filter(completed=False).count()

        # 現在の完了タスクを取得
        comp_tasks = user_tasks.filter(completed=True)

        # 現在の完了タスク数を取得
        comp_task_count = comp_tasks.count()

        # 有効カテゴリー毎の完了タスクを取得
        user_category = user.category_creator_user.filter(is_active=True)
        res_category_tasks = self.get_active_category_comp_tasks(user_category, comp_tasks)

        # 優先度毎の完了タスクを取得
        res_priority_tasks = self.get_priority_comp_tasks(comp_tasks)

        # 今週分の完了タスクを取得
        week_comp_tasks = user_tasks.filter(
            completed=True,
            completed_at__date__gte=ReturnDateTime.get_monday_of_this_week(),
            completed_at__date__lte=ReturnDateTime.get_sunday_of_this_week(),
        )

        week_count_list = []
        # 月曜から完了タスク数をリストに格納していく
        for i in range(1, 8):
            week_count_list.append(week_comp_tasks.filter(completed_at__iso_week_day=i).count())


        data = {
            'today_comp_task_count': today_comp_task_count,
            'daily_task_number': daily_task_number,
            'week_count_list': week_count_list,
            'incomp_task_count': incomp_task_count,
            'comp_task_count': comp_task_count,
            'res_category_tasks': res_category_tasks,
            'res_priority_tasks': res_priority_tasks,
        }

        return Response(data=data, status=status.HTTP_200_OK)

    def get_active_category_comp_tasks(self, categories, tasks):
        '''
        現在有効なカテゴリーの完了タスク数を返却する

        **params**
            - categories : 有効カテゴリー
            - tasks : 完了タスク
        '''
        res = {}

        for category in categories:
            res[category.name] = 0

        for task in tasks:
            if task.target_category.is_active:
                category_name = task.target_category.name
                res[category_name] += 1

        return res

    def get_priority_comp_tasks(self, tasks):
        '''
        優先度毎の完了タスク数を返却する

        **params**
            - tasks : 完了タスク
        '''
        res = {
            '1': 0,
            '2': 0,
            '3': 0,
            '4': 0,
            '5': 0
        }

        for task in tasks:
            res[task.priority] += 1

        return res

    @action(methods=['GET'], detail=False)
    def get_schedule(self, request):
        '''
        スケジュール画面にタスクの情報を返却するアクション
        '''
        user = mUser.objects.get(auth0_id=request.query_params['auth0_id'])
        user_tasks = user.task_target_user.all()
        # 未完了タスクを取得
        incomp_tasks = user_tasks.filter(completed=False)

        data = {
            'incomp_tasks' : self.get_serializer(incomp_tasks, many=True).data,
        }
        return Response(data=data, status=status.HTTP_200_OK)

    @action(methods=['PUT'], detail=False)
    def change_label_list(self, request):
        """
        タスクのラベルを一括変更するアクション
        　追加するラベル一覧情報を返す
        """
        task_id = request.data['task_id']
        label_id_list = request.data['label_id_list']
        result = []
        try:
            task = Task.objects.get(pk=task_id)
            task.label.remove()
            for label_id in label_id_list:
                l = Label.objects.get(pk=label_id)
                task.label.add(l)
                result.append(l)
            task.save()
        except Task.DoesNotExist:
            logger.error('タスクが見つかりませんでした。')
            return Response(status=status.HTTP_400_BAD_REQUEST)
        except Label.DoesNotExist:
            logger.error('ラベルが見つかりませんでした。')
            return Response(status=status.HTTP_400_BAD_REQUEST)

        data = {
            'id': task_id,
            'label': LabelSerializer(result, many=True).data
        }
        return Response(data=data, status=status.HTTP_200_OK)

    @action(methods=['GET'], detail=False)
    def get_today_tasks(self, request):
        '''
        今日期限の未完了タスクを返却アクション
        '''
        try:
            user = mUser.objects.get(auth0_id=request.query_params['auth0_id'])
            user_tasks = user.task_target_user.all()
            today_tasks = self.get_serializer(user_tasks.filter(completed=False, deadline__date=date.today()), many=True)
            expired_tasks = self.get_serializer(user_tasks.filter(completed=False, deadline__date__lt=date.today()), many=True)
        except mUser.DoesNotExist:
            logger.error('ユーザーが見つかりませんでした。')
            return Response(status=status.HTTP_400_BAD_REQUEST)

        res = {
            'today_tasks': today_tasks.data,
            'expired_tasks': expired_tasks.data,
        }
        return Response(res, status=status.HTTP_200_OK)

    @action(methods=['GET'], detail=False)
    def get_future_tasks(self, request):
        '''
        明日から1週間まで期限の未完了タスクを返却するアクション
        '''
        try:
            user = mUser.objects.get(auth0_id=request.query_params['auth0_id'])
            user_tasks = user.task_target_user.all()
            future_tasks = self.get_serializer(user_tasks.filter(
                completed=False,
                deadline__date__gte=date.today() + timedelta(days=1),
                deadline__date__lte=date.today() + timedelta(weeks=1),
            ), many=True)
        except mUser.DoesNotExist:
            logger.error('ユーザーが見つかりませんでした。')
            return Response(status=status.HTTP_400_BAD_REQUEST)

        return Response(future_tasks.data, status=status.HTTP_200_OK)

    @action(methods=['GET'], detail=False)
    def get_filter_task_list(self, request):
        """
        パラメータに応じてタスクリストにフィルターをかけて取得
            selectedCategory str(カテゴリID)
            selectedPriority str(1~5) ※複数選択の場合,カンマ区切り
            selectedDeadline str(1~5)
                1: 今日中
                2: 明日まで
                3: 3日以内
                4: 1週間以内
                5: 今月中
                6: 期限なし
            selectedLabelList str(ラベルID) ※複数選択の場合,カンマ区切り
            isCompleteTask str(true or false)
            taskList str(タスクID) ※複数選択の場合,カンマ区切り


            ● params
                key:
                    param名
                value:
                    isMultiple - 複数のデータか

            ● filterRelatedName
                key:
                    paramsのkey
                value:
                    filterで使うquery
        """

        params = {
            'selectedCategory': True,
            'selectedPriority': True,
            'selectedDeadline': False,
            'selectedLabelList': True,
            'isCompletedTask': False,
        }

        filterRelatedName = {
            'selectedCategory': 'target_category__id__in',
            'selectedPriority': 'priority__in',
            'selectedDeadline': 'deadline',
            'selectedLabelList': 'label__id__in',
            'isCompletedTask': 'completed',
        }

        try:
            user = mUser.objects.get(auth0_id=request.query_params['auth0_id'])
            taskList = user.task_target_user.all()
        except mUser.DoesNotExist:
            logger.error('ユーザーが見つかりませんでした。')
            return Response(status=status.HTTP_400_BAD_REQUEST)

        if request.query_params.get('searchText') != None:
            taskList = self.task_filter(taskList, request.query_params['searchText'], True)

        elif request.query_params.get('categoryId') != None:
            taskList = taskList.filter(
                Q(target_category__id=request.query_params['categoryId'])
            )

        query_params = self.castIsCompletedTask(request.query_params)

        logger.debug(query_params)

        for key, isMultiple in params.items():
            value = query_params[key] if key in query_params else None
            if value != None:
                if isMultiple:
                    value = list(map(int, value.split(',')))
                taskList = self.filterValue(taskList, filterRelatedName[key], value)

        return Response(self.get_serializer(taskList, many=True).data, status=status.HTTP_200_OK)

    def filterValue(self, queryset, key, value):
        """
        クエリーパラメータの値でタスクを絞る
        """
        castParams = {
            'deadline': 'self.castDeadLineParam'
        }

        if key in castParams.keys():
            key, value = eval(castParams[key])(value)
        return queryset.filter(**{key: value})

    def castDeadLineParam(self, param):
        """
        1: 今日中
        2: 明日まで
        3: 3日以内
        4: 1週間以内
        5: 今月中
        6: 期限なし
        """
        today = datetime.today()
        tommorow = today + timedelta(days=2)
        threeDays = today + timedelta(days=4)
        nextWeek = today + timedelta(weeks=1, days=1)
        nextMonth = today + relativedelta(months=1, days=1)

        deadLineParams = {
            '1': ['deadline', today],
            '2': ['deadline__range', [today, tommorow]],
            '3': ['deadline__range', [today, threeDays]],
            '4': ['deadline__range', [today, nextWeek]],
            '5': ['deadline__range', [today, nextMonth]],
            '6': ['deadline', None],
        }

        return deadLineParams[param][0], deadLineParams[param][1]

    def castIsCompletedTask(self, params):

        param = 'isCompletedTask'
        paramsDict = dict(params)

        if param in paramsDict:
            if paramsDict[param][0] == 'true':
                del paramsDict[param]
            else:
                paramsDict[param] = False
        return paramsDict


    def task_filter(self, tasks, value, isAll):
        """
        検索文字列でタスク絞る
        """

        t_list = []
        l_list = []
        s_list = []
        qs = list({i.strip() for i in value.split(',')})
        for q in qs:
            t_list.append('Q(content__contains="{}")'.format(q))
            l_list.append('Q(label__name__contains="{}")'.format(q))
            s_list.append('Q(subtask_target_task__content__contains="{}")'.format(q))
        query_str = '&'.join(t_list) + '|'
        query_str += '|'.join(l_list) + '|'
        query_str += '|'.join(s_list)
        if isAll:
            res = tasks.filter(eval(query_str)).distinct()
        else:
            res = tasks.filter(eval(query_str), completed=False).distinct()
        return res

class SubTaskViewSet(BaseModelViewSet):

    permission_classes = (permissions.IsAuthenticated,)
    queryset = SubTask.objects.all()
    serializer_class = SubTaskSerializer

    def create(self, request, *args, **kwargs):

        logger.debug("create")
        logger.debug(request.data)
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            self.perform_create(serializer)
            return Response(self.get_serializer(serializer.instance).data, status=status.HTTP_201_CREATED)

        logger.debug(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        data = self.get_serializer(instance).data
        self.perform_destroy(instance)
        return Response(data, status=status.HTTP_200_OK)

    @action(methods=['PUT'], detail=False)
    def complete(self, request):
        """
        該当サブタスクの完了フラグを立てるアクション
            完了したサブタスクリストを返す
            ※既に完了したものも送られてくる可能性があるため、サブタスクを一括更新
        """
        task_id = request.data['task_id']
        complete_sub_task_list = request.data['compelete_sub_task_list']
        sub_task_list = []
        result = []

        try:
            task = Task.objects.get(pk=task_id)
            subTasks = task.subtask_target_task.all()
            for subTask in subTasks.iterator():
                isMatched = False
                for complete_sub_task in complete_sub_task_list:
                    if subTask.id == complete_sub_task['id']:
                        isMatched = True
                        subTask.completed = True
                        if subTask.completed_at == None: subTask.completed_at = timezone.datetime.now()
                        result.append(subTask)
                if isMatched == False:
                    subTask.completed = False
                    subTask.completed_at = None
                sub_task_list.append(subTask)
            SubTask.objects.bulk_update(sub_task_list, ['completed', 'completed_at'])
        except Task.DoesNotExist:
            logger.error('タスクが見つかりませんでした。')
            return Response(status=status.HTTP_400_BAD_REQUEST)

        return Response({
            'target_task': task_id,
            'sub_tasks': self.get_serializer(subTasks, many=True).data,
            'complete_sub_tasks': self.get_serializer(result, many=True).data
        }, status=status.HTTP_200_OK)



class LabelViewSet(BaseModelViewSet):

    permission_classes = (permissions.IsAuthenticated,)
    queryset = Label.objects.all()
    serializer_class = LabelSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            self.perform_create(serializer)
            return Response(self.get_serializer(serializer.instance).data, status=status.HTTP_201_CREATED)

        logger.debug(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    @action(methods=['DELETE'], detail=False)
    def deleteTaskLabels(self, request):
        task_id = request.data['task_id']
        delete_label_list = request.data['delete_label_list']
        result = []

        try:
            task = Task.objects.get(pk=task_id)
            labels = task.label.all().iterator()
            for label in labels:
                for delete_label in delete_label_list:
                    if label.id == delete_label['id']:
                        task.label.remove(label)
                        result.append(label)
                        task.save()
        except Task.DoesNotExist:
            logger.error('タスクが見つかりませんでした。')
            return Response(status=status.HTTP_400_BAD_REQUEST)

        return Response({
            'target_task': task_id,
            'delete_labels': self.get_serializer(result, many=True).data
        }, status=status.HTTP_200_OK)

    @action(methods=['GET'], detail=False)
    def checkDuplication(self, request):
        """
        ラベル名の重複チェック
        """
        logger.info(request.query_params)
        logger.info(request.query_params['name'])

        auth0_id = request.query_params['auth0_id']
        name = request.query_params['name']
        try:
            author = mUser.objects.get(auth0_id=auth0_id)
            Label.objects.get(name=name, author=author)
        except Label.DoesNotExist:
            return Response({'status': 'success', 'result': True}, status=status.HTTP_200_OK)
        except Label.MultipleObjectsReturned:
            # TODO 重複チェックして登録させないつもりだが・・・
            return Response({'status': 'success', 'result': False}, status=status.HTTP_200_OK)
        else:
            return Response({'status': 'success', 'result': False}, status=status.HTTP_200_OK)


class KarmaViewSet(BaseModelViewSet):

    permission_classes = (permissions.IsAuthenticated,)
    queryset = Karma.objects.all()
    serializer_class = KarmaSerializer
    filter_class = KarmaFilter

    @action(methods=['GET'], detail=False)
    def get_info(self, request):
        '''
        現在のカルマ情報を返却するアクション
        '''
        user = mUser.objects.get(auth0_id=request.query_params['auth0_id'])
        user_karma = user.karma_target_user.all()

        # 現在の合計カルマポイントを取得
        total_result = user_karma.aggregate(sum_of_point=Sum('point'))
        # カルマポイントがない場合は0を入れる
        total = total_result['sum_of_point'] if total_result['sum_of_point'] != None else 0
        info = self.get_karma_info(total)

        # 今週のカルマポイントを取得

        # 月曜からカルマポイントをリストに格納していく
        week_karma_point = []
        for i in range(0, 7):
            result = user_karma\
                .filter(
                    created_at__date__lt=ReturnDateTime.get_monday_of_this_week() + timedelta(days=i)
                )\
                .aggregate(sum_of_point=Sum('point'))
            point = result['sum_of_point'] if result['sum_of_point'] != None else 0
            week_karma_point.append(point)

        data = {
            'rank': info['rank'],
            'msg': info['msg'],
            'total_point': total,
            'next_point': info['next_point'],
            'up_to_next_point': info['up_to_next_point'],
            'week_karma_point': week_karma_point,
        }
        return Response(data=data, status=status.HTTP_200_OK)

    def get_karma_info(self, point):
        '''
        カルマ情報を返却する
            params:
                - point : 現在の合計ポイント

            return:
                ポイントに応じたカルマ情報
        '''
        if point < 100:
            up_to_next_point = 100 - point
            return { 'rank': '初心者', 'msg': 'あなたは初心者だ', 'next_point': 100, 'up_to_next_point': up_to_next_point}
        elif point < 200:
            up_to_next_point = 200 - point
            return { 'rank': '中級者', 'msg': 'あなたは中級者なのです', 'next_point': 200, 'up_to_next_point': up_to_next_point}
        elif point < 300:
            up_to_next_point = 300 - point
            return { 'rank': '上級者', 'msg': 'あなたは上級者だ。頑張れ', 'next_point': 300, 'up_to_next_point': up_to_next_point}
        else:
            return { 'rank': 'マスター', 'msg': 'あなたはマスターしてる。さらに頑張れ', 'next_point': 0, 'up_to_next_point': 0}


class SettingViewSet(BaseModelViewSet):
    permission_classes = (permissions.IsAuthenticated,)
    queryset = mSetting.objects.all()
    serializer_class = SettingSerializer


class AuthView(BaseModelViewSet):
    permission_classes = (permissions.AllowAny,)
    queryset = mUser.objects.all()
    serializer_class = UserSerializer

    @action(methods=['POST'], detail=False)
    def get_oauth_token(self, request):
        url = request.data['url']
        header = {'Content-Type': 'application/x-www-form-urlencoded'}
        payload = {
            'grant_type': request.data['grant_type'],
            'client_id': request.data['client_id'],
            'client_secret': request.data['client_secret'],
            'audience': request.data['audience'],
        }
        payload = urllib.parse.urlencode(payload)
        response = requests.post(url, data=payload, headers=header)
        return Response(response.json(), status=status.HTTP_200_OK)

    @action(methods=['DELETE'], detail=False)
    def delete_auth_user(self, request):
        url = request.data['url']
        header = request.data['headers']
        response = requests.delete(url, headers=header)
        return Response(response.json(), status=status.HTTP_200_OK)
