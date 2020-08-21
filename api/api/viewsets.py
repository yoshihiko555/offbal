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
    ProjectMemberShip,
    Section,
    Task,
    SubTask,
    Label,
    Karma,
)

import logging
logger = logging.getLogger(__name__)


class BaseModelViewSet(viewsets.ModelViewSet):

    pass


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


class SectionViewSet(BaseModelViewSet):

    permission_classes = (permissions.AllowAny,)
    queryset = Section.objects.all()
    serializer_class = SectionSerializer


class TaskViewSet(BaseModelViewSet):

    permission_classes = (permissions.AllowAny,)
    queryset = Task.objects.all()
    serializer_class = TaskSerializer


class LabelViewSet(BaseModelViewSet):

    permission_classes = (permissions.AllowAny,)
    queryset = Label.objects.all()
    serializer_class = LabelSerializer


class KarmaViewSet(BaseModelViewSet):

    permission_classes = (permissions.AllowAny,)
    queryset = Karma.objects.all()
    serializer_class = KarmaSerializer
