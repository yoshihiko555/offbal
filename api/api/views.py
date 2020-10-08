from rest_framework.decorators import api_view
from django.http import HttpResponse
from rest_framework import status, generics, permissions
from rest_framework.response import Response
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
from .serializers import (
    UserSerializer,
    SettingSerializer,
    CategorySerializer,
    CategoryMemberShipSerializer,
    SectionSerializer,
    TaskSerializer,
    LabelSerializer,
    KarmaSerializer,
    DefaultCategorySerializer,
)

from .mixins import (
    GetLoginUserMixin,
)
from .filters import (
    TaskFilter,
)
from api.mails import (
    send_signup_mail,
)
import logging

logger = logging.getLogger(__name__)


class SignupView(generics.CreateAPIView, GetLoginUserMixin):
    '''
    サインアップ時に初期データ作成する
    '''
    permission_classes = (permissions.AllowAny,)
    queryset = mUser.objects.all()
    serializer_class = UserSerializer

    def create(self, request, *args, **kwargs):
        self.auth0_id = request.data['auth0_id']
        serializer = self.get_serializer(data=request.data)
        if (serializer.is_valid()):
            self.perform_create(serializer)
            user = mUser.objects.get(auth0_id=serializer.data['auth0_id'])
            mSetting.objects.create(
                target_user=user
            )

            # 選択されたカテゴリーを作成してユーザーに紐付ける
            categories = []
            req_categorys = request.data['categories']
            for i, category in enumerate(req_categories, 1):
                categories.append(Category(
                    creator=user,
                    name=category['name'],
                    color=category['color'],
                    icon=category['icon'],
                    index=i,
                ))
            Category.objects.bulk_create(categories)

            # サインアップのメールを送信する
            send_signup_mail(user, request.data['email'], request.data['profile_img'])
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        logger.info(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AppInitView(generics.ListAPIView, GetLoginUserMixin):
    '''
    アプリ初期描画時に必要なデータを取得
    '''
    permission_classes = (permissions.AllowAny,)

    def list(self, request, *args, **kwargs):
        self.set_auth0_id(request)
        try:
            user = mUser.objects.get(auth0_id=request.query_params['auth0_id'])
            categories = Category.objects.filter(creator=user, is_active=True).order_by('index')
            category_serializer = CategorySerializer(categories, many=True, context={ 'view' : self })
            labels = Label.objects.filter(author=user)
            label_serializer = LabelSerializer(labels, many=True, context={ 'view' : self })
            karmas = Karma.objects.filter(target_user=user)
            karma_serializer = KarmaSerializer(karmas, many=True, context={ 'view' : self })
            setting = user.setting_target_user
            setting_serializer = SettingSerializer(setting)
            return Response(
                {
                    'categories': category_serializer.data,
                    'labels': label_serializer.data,
                    'karma': karma_serializer.data,
                    'setting': setting_serializer.data,
                    'result': True,
                },
                status=status.HTTP_200_OK
            )
        except Exception as e:
            logger.info(e)
            logger.info('初期化が完了していない')
            return Response(
                {
                    'result': False,
                },
                status=status.HTTP_400_BAD_REQUEST
            )


class DefaultCategoriesView(generics.ListAPIView, GetLoginUserMixin):
    '''
    デフォルトカテゴリー一覧を返却する
    '''
    permission_classes = (permissions.AllowAny,)
    queryset = DefaultCategory.objects.all()
    serializer_class = DefaultCategorySerializer

    def list(self, request, *args, **kwargs):
        self.set_auth0_id(request)
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        try:
            user = mUser.objects.get(auth0_id=request.query_params['auth0_id'])
            logger.info('初期化が完了している')
            return Response(
                {
                    'default_categories': serializer.data,
                    'result': True,
                },
                status=status.HTTP_200_OK
            )
        except mUser.DoesNotExist:
            logger.info('初期化が完了していない')
            return Response(
                {
                    'default_categories': serializer.data,
                    'result': False,
                },
                status=status.HTTP_200_OK
            )


class SearchView(generics.ListAPIView, GetLoginUserMixin):
    permission_classes = (permissions.AllowAny,)
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    filter_class = TaskFilter

    def list(self, request, *args, **kwargs):
        logger.debug(request.query_params)
        self.set_auth0_id(request)
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(
                page,
                many=True
            )
            return self.get_paginated_respose(serializer.data)
        serializer = self.get_serializer(
            queryset,
            many=True
        )
        return Response(serializer.data)
