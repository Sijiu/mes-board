/**
 * Created by GF on 2016/3/8.
 */
$(function(){
    UE.registerUI('imgSpace selectTmp', function(editor, uiName) {
        //注册按钮执行时的command命令，使用命令默认就会带有回退操作
        editor.registerCommand(uiName, {
            execCommand: function() {
                alert('execCommand:' + uiName)
            }
        });
        // 自定义按钮的title和样式
        var title_text = uiName == 'imgSpace' ? '图片空间' : '选取模板';
        var button_style = 'height: 16px !important;width: 52px !important;background: url(/static/image/editor-icon.png)';
        button_style += uiName == 'imgSpace' ? ' -15.5px -1248.5px !important;' : ' -15px -1267px !important;';
        var clk_func;
        if(uiName == 'imgSpace'){
            clk_func = function(){
                $("#image-space-modal2").modal("show");
            }
        }else{
            clk_func = function(){
                if($("#shop-id").length){
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
                }
            }
        }
        //创建一个button
        var btn = new UE.ui.Button({
            //按钮的名字
            name: uiName,
            //提示
            title: title_text,
            //添加额外样式,指定icon图标,这里默认使用一个重复的icon
            cssRules: button_style,
            //点击时执行的命令
            onclick: clk_func
        });
        //当点到编辑内容上时，按钮要做的状态反射
        editor.addListener('selectionchange', function() {
            var state = editor.queryCommandState(uiName);
            if (state == -1) {
                btn.setDisabled(true);
                btn.setChecked(false);
            } else {
                btn.setDisabled(false);
                btn.setChecked(state);
            }
        });
        //因为你是添加button,所以需要返回这个button
        return btn;
    });
});