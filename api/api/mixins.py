from .models import (
    Karma,
)

import logging
logger = logging.getLogger(__name__)

class GetLoginUserMixin:
    """
    Getで来たauth0_idを取得するメソッド
    Viewsetなどで継承して使う
    """

    def set_auth0_id(self, request):
        if 'auth0_id' in request.query_params:
            self.auth0_id = request.query_params['auth0_id']


    def get_auth0_id(self):
        return getattr(self, 'auth0_id', None)


    def set_ordering_type(self, request):
        if 'ordering_type' in request.query_params:
            self.ordering_type = request.query_params['ordering_type']


    def get_ordering_type(self):
        return getattr(self, 'ordering_type', None)


class CreateKarmaMixin:
    '''
    カルマを作成するためのMixin
    Viewsetなどで継承して使う
    '''

    '''
    カルマのアクティビティタイプID
    '''
    ADD_TASK = 0                        # タスクを追加した
    COMP_IN_PERIOD_TASK = 1             # 期限内にタスクを完了した
    COMP_DAILY_TARGET_TASK = 2          # １日のゴールに設定したタスク数を完了した
    COMP_A_WEEK_TARGET_TASK = 3         # １週間のゴールに設定したタスク数を完了した
    ACHIEVEMENT_NUMBER_DATE_GOAL = 4    # 数日間に渡り連続してゴールを達成した
    ACHIEVEMENT_NUMBER_WEEKLY_GOAL = 5  # 数週間に渡り連続してゴールを達成した
    SET_LABEL = 6                       # タスクにラベルを設定した
    SET_RECURRING_SCHEDULED = 7         # タスクを繰り返しの予定として設定した
    SET_REMINDER = 8                    # タスクにリマインダーを設定した
    PAST_PLAN_FOUR_DAYS_TASK_EXISTS = 9 # 予定を４日間過ぎたタスクが存在する

    KARMA_ACTIVITY_NAME = {
        0 : 'タスク追加',
        1 : '期限内にタスク完了',
        2 : '１日のタスクを完了',
        3 : '１週間のタスクを完了',
        4 : '数日間連続してゴール達成',
        5 : '数週間連続してゴール達成',
        6 : 'ラベルを設定',
        7 : '繰り返しの予定を設定',
        8 : 'リマインダーを設定',
        9 : '４日間期限を過ぎたタスクが存在',
    }

    KARMA_ACTIVITY_POINT = {
        0 : 1,
        1 : 5,
        2 : 10,
        3 : 20,
        4 : 20,
        5 : 30,
        6 : 3,
        7 : 3,
        8 : 3,
        9 : -10,
    }

    def create_karma(self, user, activity_type):
        activity = self.KARMA_ACTIVITY_NAME[activity_type]
        point = self.KARMA_ACTIVITY_POINT[activity_type]
        Karma.objects.create(
            target_user=user,
            activity_type=activity_type,
            activity=activity,
            point=point,
        )