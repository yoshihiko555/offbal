from django.db.models import Q
from django_filters import rest_framework as django_filter
from .models import (
    mUser,
    Week,
    mSetting,
    Category,
    CategoryMemberShip,
    Section,
    Task,
    SubTask,
    Label,
    Karma,
)

import logging
logger = logging.getLogger(__name__)

class CategoryFilter(django_filter.FilterSet):

    auth0_id = django_filter.CharFilter(method='user_filter')

    class Meta:
        model = Category
        fields = []

    def user_filter(self, queryset, name, value):
        user = mUser.objects.get(auth0_id=value)
        res = queryset.filter(creator=user).order_by('index')
        return res


class LabelFilter(django_filter.FilterSet):

    auth0_id = django_filter.CharFilter(method='user_filter')

    class Meta:
        model = Label
        fields = []

    def user_filter(self, queryset, name, value):
        user = mUser.objects.get(auth0_id=value)
        res = queryset.filter(author=user)
        return res


class KarmaFilter(django_filter.FilterSet):

    auth0_id = django_filter.CharFilter(method='user_filter')

    class Meta:
        model = Karma
        fields = []

    def user_filter(self, queryset, name, value):
        user = mUser.objects.get(auth0_id=value)
        res = queryset.filter(target_user=user)
        return res


class TaskFilter(django_filter.FilterSet):

    auth0_id = django_filter.CharFilter(method='user_filter')
    searchText = django_filter.CharFilter(method='task_filter')

    class Meta:
        model = Task
        fields = []

    def user_filter(self, queryset, name, value):
        user = mUser.objects.get(auth0_id=value)
        res = queryset.filter(target_user=user)
        return res

    def task_filter(self, queryset, name, value):
        """
        タスク内容、ラベル名、サブタスク内容に一致するタスクを検索する。
        """
        t_list = []
        l_list = []
        s_list = []
        qs = list({i.strip() for i in value.split(',')})
        for q in qs:
            t_list.append('Q(content__contains="{}")'.format(q))
            l_list.append('Q(label__name="{}")'.format(q))
            s_list.append('Q(subtask_target_task__content__contains="{}")'.format(q))
        query_str = '&'.join(t_list) + '|'
        query_str = '&'.join(l_list) + '|'
        query_str = '&'.join(s_list)
        res = queryset.filter(eval(query_str))
        return res
