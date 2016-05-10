# -*- coding: utf-8 -*-
from cStringIO import StringIO
import random
from string import lowercase, digits
import pymongo
from PIL import Image
from bson import ObjectId
from gridfs import GridFS

conn = pymongo.MongoClient(host="localhost", port=27017)

db = conn['MsgBoard']
fs = GridFS(db, collection='picture')
fs_conn = db.picture.files


class SeverFS(object):
    def __init__(self):
        self.gfs = fs
        self.conn = fs_conn

    def save(self, content, **kwargs):
        im_fd = StringIO(content)
        im = Image.open(im_fd)
        kwargs["size"] = "%d*%d" % im.size
        if not kwargs.get("filename"):
            kwargs["filename"] = self.gen_pic_name()
        if len(content) > 500 * 1024:
            im.thumbinal(im.size, im.ANTIALIAS)
            im_obj = StringIO()
            im.save(im_obj, "JPEG")
            im_obj.seek(0)
            file_id = self.gfs.put(im_obj.read(), **kwargs)
            im_obj.close()
        else:
            file_id = self.gfs.put(content, **kwargs)
        im_fd.close()
        return file_id

    @staticmethod
    def gen_pic_name(length=8):
        chars = lowercase + digits
        random_str = "".join([random.choice(chars) for i in xrange(length)])
        return random_str + "." + "jpg"

    def find(self, skip=0, limit=0, **kwargs):
        if limit:
            # ps = self.conn.find(kwargs).skip(skip).limit(limit).sort("uploadDate", pymongo.DESCENDING)
            ps = self.conn.find(kwargs).skip(skip).limit(limit)
            return ps
        else:
            # return self.conn.find(kwargs).skip(skip).sort("uploadDate", pymongo.DESCENDING)
            return self.conn.find(kwargs).skip(skip)

    def get(self, file_id):
        return self.gfs.get(ObjectId(file_id))

    def get_count(self, **kwargs):
        return self.gfs.find(kwargs).count()


server_fs = SeverFS()
# print server_fs.get_count()
# print server_fs.find(**{"username": "hello"})
