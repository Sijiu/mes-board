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
    def get(self):
        replies = self.db.boards.find().sort('reply_time', pymongo.DESCENDING)
        replies_count = self.db.boards.find().count()
        p = int(self.get_argument('p', 1))
        print "replies", replies
        self.render(
            'index.html',
            replies=replies,
            replies_count=replies_count,
            p=p,
        )

    @tornado.gen.coroutine
    def post(self, *args, **kwargs):
        method_router = {
            "msg": self.display_msg
        }
        try:
            category = args[0]
            result = method_router[category]
            print "result--", result
            self.write(result)
        except Exception, e:
            # logger.error(traceback.format_exc(e))
            self.render("500.html")

    def display_msg(self):
        content = self.get_argument('content', '')
        p = int(self.get_argument('p', 1))
        cur_time = time.strftime(ISOTIMEFORMAT, time.localtime(time.time()))
        author = self.get_current_user()["username"]
        author_photo = self.get_current_user()["user_photo"]
        ip = self.request.remote_ip
        content_html = self.make_html(content)
        index = self.db.boards.find().count()
        error, success, replies = 0, 0, ""
        # print content, cur_time, author, ip, content_html, index
        try:
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
            success += 1
        except Exception, e:
            print "insert failed."
            error += 1
        page = "index.html"
        render_setting = {
            'replies': replies,
            'replies_count': index + 1,
            'p': p,
            'json': {
                "success": success,
                'error': error,
            },
        }
        # return page, render_setting



handlers = [
    (r"/msg", IndexHandler),
    (r"/signup", SignupHandler),
    (r"/signin", SigninHandler),
    (r"/signout", SignoutHandler),
    (r"/about", AboutHandler),
    (r"/user/(\w+)", UserHandler),
    (r"/picture/([\w/]+)", PictureHandler),
    (r"/image/(\w+)/([\w+\.]+)", ImageHandler),
]
