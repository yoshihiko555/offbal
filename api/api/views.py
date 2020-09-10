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
)
from .serializers import (
    UserSerializer,
    SettingSerializer,
    CategorySerializer,
    CategoryMemberShipSerializer,
    SectionSerializer,
    TaskSerializer,
    LabelSerializer,
    KarmaSerializer
)

from .mixins import (
    GetLoginUserMixin,
)
import logging

logger = logging.getLogger(__name__)


class SignupView(generics.CreateAPIView, GetLoginUserMixin):
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
            categorys = []
            req_categorys = request.data['categorys']
            for category in req_categorys:
                categorys.append(Category(
                    creator=user,
                    name=category
                ))
            Category.objects.bulk_create(categorys)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        logger.info(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AppInitView(generics.ListAPIView, GetLoginUserMixin):
    permission_classes = (permissions.AllowAny,)

    def list(self, request, *args, **kwargs):
        self.set_auth0_id(request)
        user = mUser.objects.get(auth0_id=request.query_params['auth0_id'])
        categorys = Category.objects.filter(creator=user)
        # categorys = Category.objects.filter(creator=user).order_by('musercategoryrelation__index')
        category_serializer = CategorySerializer(categorys, many=True, context={ 'view' : self })
        labels = Label.objects.filter(author=user)
        label_serializer = LabelSerializer(labels, many=True, context={ 'view' : self })
        karmas = Karma.objects.filter(target_user=user)
        karma_serializer = KarmaSerializer(karmas, many=True, context={ 'view' : self })
        return Response(
            {
                'categorys': category_serializer.data,
                'labels': label_serializer.data,
                'karma': karma_serializer.data,
            },
            status=status.HTTP_200_OK
        )
