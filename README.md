留言板
===

Python Web框架Tornado入门练习小项目：留言板

### 已经实现的功能：

- 用户的注册与登录，包括昵称，密码等合法性要求的检查
- 主要功能：用户登录后，进行留言
- 用户留言信息的显示：用户名，客户端ip，留言内容，留言时间
- 回复功能
- 留言数量过多，会自动分页显示功能
- 仪表盘，统计站点用户数量和留言数量

### 站点展示：

站点后台采用tornado，前台采用Amazon UI，数据库采用MongoDB

![站点快照](https://raw.githubusercontent.com/su-kaiyao/mes-board/master/imgs/demo.png)
###--------2016-5-10 20:40:12 更新--
- 调整仪表盘为页脚，所有页面可见
- 在右上方添加显示登录用户头像和用户名
- 添加用户头像，用户编辑。自定义头像
- 用户上传图片功能

###-------2016-5-11 13:45:42 更新--
- 添加KindEditor编辑器
- 添加留言者显示头像，以及点击留言者用户名或者头像编辑头像链接


![站点快照2](https://raw.githubusercontent.com/Sijiu/mes-board/master/imgs/v0.2.jpg)
### 待完成：
- - A回复B的留言，加入提醒功能（站点提醒＋邮件提醒）
- 编辑美化用户头像，（接入美图秀秀在线编辑器，以此解决图片裁剪，水印功能）
- 更新留言编辑器，先尝试KindEditor，再尝试UEditor，可能的话尝试多编辑期切换功能
- 修正留言页面刷新后重复留言的重大bug
- 未完待续...

代码是赶出来的，出错之处，多多包涵

**喜欢的朋友，能否给个star呢**
