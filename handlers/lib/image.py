# -*- coding: utf-8 -*-
from handlers.lib.base import BaseHandler
from handlers.lib.sever_pic import server_fs


class ImageHandler(BaseHandler):
    def get(self, *args, **kwargs):
        picture_name = args[1]
        file_id = picture_name.split(".")[0]
        out = server_fs.get(file_id)
        file_content = out.read()
        headers = {
            "Content-Type": out.content_type or "image/jpeg",
            "Content-Length": out.length or len(file_content),
            "Cache-Control": "max-age=604800"
        }
        for k, v in headers.items():
            self.set_header(k, v)
        self.write(file_content)
