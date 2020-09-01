from django.db.models import Q
from django_filters import rest_framework as django_filter
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

class ProjectFilter(django_filter.FilterSet):

    user_id = django_filter.CharFilter(method='user_filter')

    class Meta:
        model = Project
        fields = []

    def user_filter(self, queryset, name, value):
        user = mUser.objects.get(auth0_id=value)
        res = queryset.filter(member=user)
        return res


class LabelFilter(django_filter.FilterSet):

    user_id = django_filter.CharFilter(method='user_filter')

    class Meta:
        model = Label
        fields = []

    def user_filter(self, queryset, name, value):
        user = mUser.objects.get(auth0_id=value)
        res = queryset.filter(author=user)
        return res
