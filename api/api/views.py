from rest_framework.decorators import api_view
from django.http import HttpResponse
from rest_framework import status, generics, permissions
from rest_framework.response import Response
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

import logging

logger = logging.getLogger(__name__)


class SignupView(generics.CreateAPIView):
    permission_classes = (permissions.AllowAny,)
    queryset = mUser.objects.all()
    serializer_class = UserSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if (serializer.is_valid()):
            self.perform_create(serializer)
            user = mUser.objects.get(auth0_id=serializer.data['auth0_id'])
            mSetting.objects.create(
                target_user=user
            )
            project = Project.objects.create(
                creator=user,
                name='インボックス'
            )
            project.member.add(user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        logger.info(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
