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
from django.db.models import Sum

from .serializers import (
    UserSerializer,
    SettingSerializer,
    ProjectSerializer,
    ProjectMemberShipSerializer,
    SectionSerializer,
    TaskSerializer,
    LabelSerializer,
    KarmaSerializer
)
from .models import (
    mUser,
    Week,
    mSetting,
    Project,
    mUserProjectRelation,
    ProjectMemberShip,
    Section,
    Task,
    SubTask,
    Label,
    Karma,
)

from .filters import (
    ProjectFilter,
    KarmaFilter,
)

from .mixins import (
    GetLoginUserMixin,
    CreateKarmaMixin,
)

import logging
logger = logging.getLogger(__name__)


class BaseModelViewSet(viewsets.ModelViewSet, GetLoginUserMixin, CreateKarmaMixin):

    def list(self, request, *args, **kwargs):
        self.set_auth0_id(request)
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class UserViewSet(BaseModelViewSet):

    permission_classes = (permissions.AllowAny,)
    queryset = mUser.objects.all()
    serializer_class = UserSerializer

    def list(self, request, *args, **kwargs):
        logger.debug('=======================USER VIEW SET=====================')
        return super().list(request, *args, **kwargs)


class ProjectViewSet(BaseModelViewSet):

    permission_classes = (permissions.AllowAny,)
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    filter_class = ProjectFilter

    def create(self, request, *args, **kwargs):
        self.auth0_id = request.data['auth0_id']
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            self.perform_create(serializer)
            try:
                user = mUser.objects.get(auth0_id=request.data['auth0_id'])
                mUserProjectRelation.objects.create(
                    user=user,
                    project=serializer.instance,
                    index=self.autoincrement(user),
                )

            except mUser.DoesNotExist:
                logger.error('mUserが見つかりませんでした。')
                return Response(status=status.HTTP_400_BAD_REQUEST)
            except Project.DoesNotExist:
                logger.error('Projectが見つかりませんでした。')
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

    @action(methods=['GET'], detail=False)
    def checkProjectDuplication(self, request):
        '''
        プロジェクト作成時のプロジェクト名重複チェック
        '''
        auth0_id = request.query_params['auth0_id']
        name = request.query_params['name']
        try:
            user = mUser.objects.get(auth0_id=auth0_id)
            user_project = user.project_member.all()
            user_project.get(name=name)
        except Project.DoesNotExist:
            return Response({'status': 'success', 'result': True}, status=status.HTTP_200_OK)
        else:
            return Response({'status': 'success', 'result': False}, status=status.HTTP_200_OK)

    @action(methods=['GET'], detail=False)
    def checkUpdateProjectDuplication(self, request):
        '''
        プロジェクト更新時のプロジェクト名重複チェック
        '''
        auth0_id = request.query_params['auth0_id']
        current_name = request.query_params['current_name']
        new_name = request.query_params['new_name']

        user = mUser.objects.get(auth0_id=auth0_id)
        user_project = user.project_member.all()
        # 現在のプロジェクト名以外のプロジェクトを取得
        filter_project = user_project.exclude(name=current_name)
        if filter_project.filter(name=new_name).count() == 0:
            # 重複するプロジェクト名が存在しない
            return Response({'status': 'success', 'result': True}, status=status.HTTP_200_OK)
        return Response({'status': 'success', 'result': False}, status=status.HTTP_200_OK)

    @action(methods=['PUT'], detail=False)
    def updateProjectIndex(self, request, pk=None):
        self.auth0_id = request.data['auth0_id']
        user = mUser.objects.get(auth0_id=request.data['auth0_id'])
        projects = []
        for i, project in enumerate(request.data['projects'], 1):
            pro = mUserProjectRelation.objects.get(user=user, project__id=project['id'])
            pro.index = i
            projects.append(pro)

        mUserProjectRelation.objects.bulk_update(projects, fields=['index'])
        user_project = user.project_member.all().order_by('muserprojectrelation__index')
        serializer = self.get_serializer(user_project, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(methods=['GET'], detail=True)
    def order_tasks(self, request, pk=None):
        self.set_ordering_type(request)
        project = Project.objects.get(pk=pk)
        serializer = self.get_serializer(project)
        return Response(serializer.data, status=status.HTTP_200_OK)


    def autoincrement(self, user):
        '''
        対象ユーザーが関与するプロジェクト総数 + 1を返却する
        '''
        res = user.project_member.all().count() + 1
        return res

class SectionViewSet(BaseModelViewSet):

    permission_classes = (permissions.AllowAny,)
    queryset = Section.objects.all()
    serializer_class = SectionSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            self.perform_create(serializer)
            return Response(self.get_serializer(serializer.instance).data, status=status.HTTP_201_CREATED)

        logger.debug(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TaskViewSet(BaseModelViewSet):

    permission_classes = (permissions.AllowAny,)
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


class LabelViewSet(BaseModelViewSet):

    permission_classes = (permissions.AllowAny,)
    queryset = Label.objects.all()
    serializer_class = LabelSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            self.perform_create(serializer)
            return Response(self.get_serializer(serializer.instance).data, status=status.HTTP_201_CREATED)

        logger.debug(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class KarmaViewSet(BaseModelViewSet):

    permission_classes = (permissions.AllowAny,)
    queryset = Karma.objects.all()
    serializer_class = KarmaSerializer
    filter_class = KarmaFilter

    @action(methods=['GET'], detail=False)
    def info(self, request, pk=None):
        user = mUser.objects.get(auth0_id=request.query_params['auth0_id'])
        total_result = Karma.objects.filter(target_user=user).aggregate(sum_of_point=Sum('point'))
        # カルマポイントがない場合は0を入れる
        total = total_result['sum_of_point'] if total_result['sum_of_point'] != None else 0
        info = self.get_karma_info(total)
        data = {
            'rank': info['rank'],
            'msg': info['msg'],
            'totalPoint': total,
        }
        return Response(data=data, status=status.HTTP_200_OK)

    def get_karma_info(self, point):
        if point < 100:
            return { 'rank': '初心者', 'msg': 'あなたは初心者だ'}
        elif point < 200:
            return { 'rank': '中級者', 'msg': 'あなたは中級者なのです'}
        elif point < 300:
            return { 'rank': '上級者', 'msg': 'あなたは上級者だ。頑張れ'}
        else:
            return { 'rank': 'マスター', 'msg': 'あなたはマスターしてる。さらに頑張れ'}
