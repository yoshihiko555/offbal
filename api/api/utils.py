from datetime import (
    datetime,
    timezone,
    timedelta
)


def utc_to_jst(timestamp_utc):
    """
    日時データのUTCをJSTに変換するメソッド
    """
    datetime_jst = timestamp_utc.astimezone(timezone(timedelta(hours=+9)))
    timestamp_jst = datetime.strftime(datetime_jst, '%Y-%m-%d %H:%M:%S')
    return timestamp_jst
