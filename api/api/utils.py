from datetime import (
    datetime,
    timezone,
    timedelta
)
from django.utils import timezone as tz
import pytz
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
    DefaultCategory,
)

def utc_to_jst(timestamp_utc):
    """
    日時データのUTCをJSTに変換するメソッド
    """
    datetime_jst = timestamp_utc.astimezone(timezone(timedelta(hours=+9)))
    timestamp_jst = datetime.strftime(datetime_jst, '%Y-%m-%d %H:%M:%S')
    return timestamp_jst

def utc_to_localtime(timestamp_utc, user_id):
    """
    UTCを設定したタイムゾーンの日時に変換するメソッド
    """
    setting = mUser.objects.get(id=user_id).setting_target_user
    user_timezone = setting.time_zone
    datetime_jst = timestamp_utc.astimezone(pytz.timezone(user_timezone))
    timestamp_jst = datetime.strftime(datetime_jst, '%Y-%m-%d %H:%M:%S')
    return timestamp_jst

class ReturnDateTime():
    '''
    日付等を返却するときに利用するクラス
    '''
    # 先週
    last_week = tz.now().date() - timedelta(days=7)
    # 先週の月曜
    monday_of_last_week = last_week - timedelta(days=(last_week.isocalendar()[2] -1))

    @classmethod
    def get_monday_of_this_week(cls):
        '''
        今週の月曜日を返却
        '''
        return cls.monday_of_last_week + timedelta(days=7)

    @classmethod
    def get_sunday_of_this_week(cls):
        '''
        今週の日曜日を返却
        '''
        return cls.get_monday_of_this_week() + timedelta(days=6)
