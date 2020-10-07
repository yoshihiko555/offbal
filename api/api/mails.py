from django.core.mail import send_mail
from django.template.loader import render_to_string
import logging

logger = logging.getLogger(__name__)

def send_signup_mail(user, email, profile_img):
    '''
    サインアップ時にメールを送信する
    '''
    subject = 'Welcome to offbal'

    context = {
        'name': user.auth0_name,
        'email': email,
        'profile_img': profile_img,
    }
    message_plain = render_to_string('mail/plain/mail-signup.txt', context)
    message_html = render_to_string('mail/html/mail-signup.html', context)
    from_email = ''
    recipient_list = [email]
    send_mail(subject, message_plain, from_email, recipient_list, html_message=message_html)

def send_schedule_mails():
    '''
    ユーザーの設定情報をもとに各メールを送信する
    '''
    send_today_result_mail()
    send_news_mail()
    send_hint_mail()

def send_today_result_mail():
    '''
    今日の結果のメールを送信する
    '''

def send_news_mail():
    '''
    お知らせメールを送信する
    '''

def send_hint_mail():
    '''
    ヒントメールを送信する
    '''
