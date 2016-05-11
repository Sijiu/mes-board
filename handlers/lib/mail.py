# -*- coding: utf-8 -*-

import smtplib
from email.mime.text import MIMEText
from email.header import Header

# sender = 'testpy2016@'
# reverser = ''
# subject = ''
# smtsever = ''
# username = 'testpy2016'
# password = 'testpy2016511'

def send_mail(
              subject,
              text,
              reverser,
              name,
              account,
              password
              ):
    sender = account
    msg = MIMEText(text, 'html', 'utf-8')
    msg['Subject'] = Header(subject, 'utf-8')
    try:
        smtp = smtplib.SMTP()
        smtp.connect(name)
        smtp.login(account, password)
        smtp.sendmail(sender, reverser, msg.as_string())
        smtp.quit()

    except Exception, e:
        print "this time is to send content: %s" % text

send_mail("testmail2", "ceshi,您好吗", "1830820670@qq.com", "smtp.163.com", "mxh403@163.com", "zxcmxh19921992")
