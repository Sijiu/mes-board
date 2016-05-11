/*
	2015.4.11 edit by fuyi
*/

		var options = {
			items:[
				'bold','italic', 'underline','strikethrough','|', 'forecolor', 'hilitecolor', '|', 'justifyleft', 'justifycenter','justifyright','justifyfull','|', 'insertunorderedlist', 'insertorderedlist', '|', 'outdent', 'indent', '|', 'subscript', 'superscript', '|','selectall', 'removeformat', '|','undo', 'redo','/',
				'fontname','fontsize', 'formatblock','|','cut','copy', 'paste','plainpaste','wordpaste','table','|','link','unlink','|','image','multiimage','|','imgSpace','|','addTemp','|','fullscreen','source','clearhtml'
			],                                           //功能按钮
			width:'100%',
			height:'300px',
			themeType:'default',                         //界面风格,可设置”default”、”simple”，指定simple时需要引v入simple.css
			langType:'zh_CN',                            //按钮提示语言（en为英语）
			newlineTag:'br',                             //设置回车换行标签，“p” “br”
			dialogAlignType:'page',                      //设置弹出框(dialog)的对齐类型，指定page时按当前页面居中，指定空时按编辑器居中
			shadowMode:'true',                           //true时弹出层(dialog)显示阴影
			zIndex:'1000000',                            //指定弹出层的基准z-index,默认值: 811213
			useContextmenu:'true',                       //true时使用右键菜单，false时屏蔽右键菜单
			colorTable:[								 //指定取色器里的颜色
				['#E53333', '#E56600', '#FF9900', '#64451D', '#DFC5A4', '#FFE500'],
				['#009900', '#006600', '#99BB00', '#B8D100', '#60D978', '#00D5FF'],
				['#337FE5', '#003399', '#4C33E5', '#9933E5', '#CC33E5', '#EE33EE'],
				['#FFFFFF', '#CCCCCC', '#999999', '#666666', '#333333', '#000000']
			],
			filterMode:false
			//cssData:'kse\\:widget {display:block;width:120px;height:120px;background:url(http://b.hiphotos.baidu.com/image/pic/item/e4dde71190ef76c666af095f9e16fdfaaf516741.jpg);}'
		};

		KindEditor.lang({imgBank:'图片银行',infoModule:'插入产品信息模块',imgSpace:'图片空间',quotePic:'引用采集图片',addTemp:'添加模板'});//图标添加title提示

		KindEditor.plugin('addTemp',function(k){ //添加模板添加点击事件
			var editor = this,
				name = 'addTemp';
				editor.clickToolbar(name,function(){
                    window.editor = this;
					function sync_info_func(type){
						var loadingBtn = $("#sync-info-btn").button("loading");
						$.ajax({
							"url": "/create/" + $("#shop-id").val() + "/information",
							"type": "POST",
							"data": {"action": type},
							"dataType": "json",
							"success": function(data){
								loadingBtn.button("reset");
                                var target = (type=="get_custom" ? $("#other-template-content") : $("#info-template-content"));
								$("#load-info").css({"display": "none"});
								if(data.status == 0){
									var err_sp = $("#error-span");
									if(err_sp.length == 1){
										err_sp.html(data.message);
									}else {
										target.append("<span id=\"error-span\" " +
										"style=\"color: #eb3c00\">" + data.message + "</span>");
									}
									return 0;
								}
								if(data["templates"].length == 0){
									target.html("未获取到模块信息，请同步<br/>");
									render_info_temps(target, data["templates"],type);
								}else{
									render_info_temps(target, data["templates"],type);
								}
							}
						});
					}
					function render_info_temps(target, templates, type){
						var table_head = "<table class=\"table table-hover " +
							"table-striped\"><tr><td>模块名称</td>" +
							"<td>模块类型</td>" + "<td>是否添加模块</td></tr>";
						var table_tail = "</table>";
						var rows = "";
						var sync_text = "<div><a href=\"javascript:void(0)\" " +
									"class=\"btn btn-success\"" + "data-loading-text=\"处理中...\""
								+"id=\"sync-info-btn\"" + ">同步信息模板</a></div>";
						for(var i=0; i<templates.length;i++) {
							var template = templates[i];
							var check_box = "<input type=\"checkbox\" " +
								" data-title=\"" + template.name + "\" data-type=\"" +
								template.type + "\" data-id=\"" + template.id + "\" />";
							rows += "<tr><td>{0}</td><td>{1}</td><td>{2}</td>"
									.format(template.name, template.type, check_box);
						}
                        if(type=="get_custom"){
                            target.html(table_head + rows + table_tail);
                        }else{
                            target.html(table_head + rows + table_tail + sync_text);
                        }
//                        $("#info-template-content").html(sync_text);
						$("#sync-info-btn").click(function(){
							sync_info_func("sync");
						});
					}
					$("#info-template-modal").modal("show");
					sync_info_func("get");
                    sync_info_func("sync");
                    sync_info_func("get_custom");
				});
		});
        KindEditor.plugin('imgSpace',function(k){
			var editor = this,
				name = 'imgSpace';
				editor.clickToolbar(name,function(){
                    window.editor = this;
                    window.btn_show_modal = "description_btn";
                    $("#image-space-modal2").modal("show");
                })
        });
		KindEditor.plugin('source',function(K){ //图标添加点击事件
			var editor = this,
				divStr = "",
				name = 'source';
				editor.clickToolbar(name,function(){
					var str = editor.html();

                    var cache = $('#detailHtml');
                    cache.empty();
                    cache.html(str);
                    divStr = cache.html();
                    if(cache.attr("data-whether") == "0") {
                        cache.find('.actneed-temp').each(function (k, v) {
                            var widget = '<kse:widget data-widget-type="{0}" id="{1}" title="{2}" type="{3}"></kse:widget>';
                            var src_str = $(v).attr("src");
                            var src = decodeURI(src_str);
							var params_str = src.split("?")[1];
							var groups = params_str.split("&");
							widget = widget.format(
								groups[2].split("=")[1] == "relation" ? "relatedProduct" : "customText",
								groups[0].split("=")[1], groups[1].split("=")[1], groups[2].split("=")[1]);
                            var origin_str = "<img src=\"" + src_str + "\" class=\"actneed-temp\" />";
                            str = str.replace(origin_str, widget);
                            console.log(str);
                        });
                        cache.attr("data-whether", "1");
                    }else {
                        cache.find("[data-widget-type]").each(function (k, v) {
                            var vv = $(v);
                            var src_str = "https://www.actneed.com/static/image/{0}?id={1}&ti={2}&ty={3}";
                            src_str = src_str.format(
                                vv.attr("type") == "custom" ? "widget1.png" : "widget2.png",
                                vv.attr("id"), vv.attr("title"), vv.attr("type"));
                            var image_url = "<img src=\"" + src_str + "\" class=\"actneed-temp\" />";
                            var origin_str = '<kse:widget data-widget-type="{0}" id="{1}" title="{2}" type="{3}"></kse:widget>';
                            origin_str = origin_str.format(
                                vv.attr("type") == "custom" ? "customText" : "relatedProduct",
                                vv.attr("id"), vv.attr("title"), vv.attr("type"));
                            str = str.replace(origin_str, image_url);
                            console.log(str);
                        });
                        cache.attr("data-whether", "0");
                    }
					editor.html(str);
				});
		});