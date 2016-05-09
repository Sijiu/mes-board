# -*- coding: utf-8 -*-


from handlers.lib.base import BaseHandler
from PIL import Image

class PictureHandler(BaseHandler):
    def get(self, *args, **kwargs):
        pass

    def post(self, *args, **kwargs):
        username = self.get_current_user()["username"]
        method_router = {
            "upload/local", self.upload_local
        }
        try:
            category = args[0]
            print category
            result = method_router[category](username)
            self.write(result)
        except Exception, e:
            # logger.error(traceback.format_exc(e))
            self.render("500.html")

    def upload_local(self, username):
        protocol = "http"
        # used_space = self.used_space_count(username)
        # if used_space < 1000:
        # group_id = self.params.get("group_id") or "tree_1"
        pictures = self.request.files.get("Filedata") or self.request.files.get("imgFile") or self.request.files["picture"]
        success, error, urls = 0, 0, list()
        for picture in pictures:
            try:
                meta = dict(
                    filename=picture["filename"],
                    content_type="image/jpeg",
                    user_name=username,
                    # group_id=group_id,
                    quote_status=0
                )
                content = picture["body"]
                _id = server_fs.save(content, **meta)
                urls.append("%s://%s/image/%s/%s.%s" % (
                    protocol, self.request.host, username,
                    str(_id), "jpg"
                ))
                success += 1
            except Exception, e:
                # logger.error(traceback.format_exc(e))
                error += 1
        render_settings = dict()
        render_settings["status"] = 1
        render_settings.update(self.picture_by_page(username, 0, ""))
        return {
            "render_settings": render_settings,
            "success": success,
            "error": error,
            "url": ";".join(urls)
        }
