#!/usr/bin/env python
# -*- coding: utf-8 -*-

import time

import pymongo
import tornado.web

from handlers.lib.base import BaseHandler
from handlers.lib.image import ImageHandler
from handlers.picture import PictureHandler
from signin import SigninHandler
from signup import SignoutHandler, SignupHandler, AboutHandler
from user import UserHandler

ISOTIMEFORMAT = '%Y-%m-%d %X'


class IndexHandler(BaseHandler):
    def get(self, *args):
        method_route ={
            "display": self.display_handler,
            "del": self.del_msg_handler
        }
        category = args[0]
        print "sss-", args[0]
        try:
            result = method_route[category]
            self.write(result)
        except Exception, e:
            self.write({"status": 0, "message": "something is error"})

    @tornado.gen.coroutine
    def post(self):
        content = self.get_argument('content', '')
        p = int(self.get_argument('p', 1))
        cur_time = time.strftime(ISOTIMEFORMAT, time.localtime(time.time()))
        author = self.get_current_user()["username"]
        author_photo = self.get_current_user()["user_photo"]
        ip = self.request.remote_ip
        content_html = self.make_html(content)
        index = self.db.boards.find().count()
        # print content, cur_time, author, ip, content_html, index
        yield self.asyn_db.boards.insert({
            'author': author,
            'author_photo': author_photo,
            'content': content,
            'reply_time': cur_time,
            'ip': ip,
            'index': index + 1,
            'content_html': content_html,
        })
        replies = self.db.boards.find().sort('reply_time', pymongo.DESCENDING)
        print "*****", replies
        self.render(
            'index.html',
            replies=replies,
            replies_count=index + 1,
            p=p,
            json={
                "success": "1"
            },
        )

    def display_handler(self):
        print "shit"
        replies = self.db.boards.find().sort('reply_time', pymongo.DESCENDING)
        replies_count = self.db.boards.find().count()
        p = int(self.get_argument('p', 1))
        page = 'index.html'
        render_setting = {
            'replies': replies,
            'replies_count': replies_count,
            'p': p,
        }
        return page, render_setting

    def del_msg_handler(self):
        pass


handlers = [
    (r"/msg/(.*)", IndexHandler),
    (r"/signup", SignupHandler),
    (r"/signin", SigninHandler),
    (r"/signout", SignoutHandler),
    (r"/about", AboutHandler),
    (r"/user/(\w+)", UserHandler),
    (r"/picture/([\w/]+)", PictureHandler),
    (r"/image/(\w+)/([\w+\.]+)", ImageHandler),
]
