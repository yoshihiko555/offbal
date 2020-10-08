from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.db.models import Q, Sum
from datetime import date
from .viewsets import (
    KarmaViewSet
)
from .models import (
    mSetting,
)

import logging

logger = logging.getLogger(__name__)

def send_signup_mail(user, profile_img):
    '''
    サインアップ時にメールを送信する
    '''
    subject = 'Welcome to offbal'

    context = {
        'name': user.auth0_name,
        'email': user.email,
        'profile_img': profile_img,
    }
    message_plain = render_to_string('mail/plain/mail-signup.txt', context)
    message_html = render_to_string('mail/html/mail-signup.html', context)
    from_email = ''
    recipient_list = [user.email]
    send_mail(subject, message_plain, from_email, recipient_list, html_message=message_html)

def send_schedule_mails():
    '''
    ユーザーの設定情報をもとに各メールを送信する
    '''
    settings = mSetting.objects\
        .filter(
            Q(mail_today_result=True) |
            Q(mail_news=True) |
            Q(mail_hint=True)
        )\
        .exclude(target_user__username='auth0user')

    for setting in settings:
        user = setting.target_user
        if setting.mail_today_result:
            send_today_result_mail(user)

        if setting.mail_news:
            send_news_mail(user)

        if setting.mail_hint:
            send_hint_mail(user)

def send_today_result_mail(user):
    '''
    今日の結果のメールを送信する
    '''
    user_karma = user.karma_target_user.all()
    # 今日のカルマポイントを集計
    today_result = user_karma.filter(created_at__date=date.today()).aggregate(sum_of_point=Sum('point'))
    today = today_result['sum_of_point'] if today_result['sum_of_point'] != None else 0

    # 現在の合計カルマポイントを取得
    total_result = user_karma.aggregate(sum_of_point=Sum('point'))
    # カルマポイントがない場合は0を入れる
    total = total_result['sum_of_point'] if total_result['sum_of_point'] != None else 0

    # 現在の情報をもとにカルマ情報を取得
    info = KarmaViewSet.get_karma_info(None, total)

    subject = user.auth0_name + '様の今日の結果'

    context = {
        'name': user.auth0_name,
        'today_result': today,
        'next_point': info['next_point'],
    }
    message_plain = render_to_string('mail/plain/mail-today-result.txt', context)
    message_html = render_to_string('mail/html/mail-today-result.html', context)
    from_email = ''
    recipient_list = [user.email]
    send_mail(subject, message_plain, from_email, recipient_list, html_message=message_html)

def send_news_mail(user):
    '''
    お知らせメールを送信する
    '''
    print('お知らせメール')

def send_hint_mail(user):
    '''
    ヒントメールを送信する
    '''
    print('ヒント！！')
