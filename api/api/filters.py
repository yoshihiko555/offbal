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
