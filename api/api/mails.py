from django.core.mail import send_mail
from django.template.loader import render_to_string
import logging

logger = logging.getLogger(__name__)

class SendMail():
    def test_mail(self):
        subject = '題名'
        context = {
            'name': 'ほげほげ',
            'email': 'md.takizawa@gmail.com',
            'content': '内容を記入',
        }
        message = render_to_string('mail/test.txt', context)
        from_email = ''
        recipient_list = ['md.takizawa@gmail.com']
        send_mail(subject, message, from_email, recipient_list)
