/**
 * Created by Administrator on 2016/5/9.
 */
$(function(){
    var images = [];
    $('#upload').Huploadify({
		auto:true,
		fileTypeExts:'*.jpg;*.png;*.gif',
		multi:true,
		fileObjName:'Filedata',
		fileSizeLimit:9999,
		showUploadedPercent:true,//是否实时显示上传的百分比，如20%
		showUploadedSize:false,
		removeTimeout:2000,
		buttonText:'编辑头像',//上传按钮上的文字
		uploader:"/picture/upload/local",
        onInit:function(){
			console.log('初始化');
		},
		onUploadStart:function(){
			console.log('开始上传');
		},

		onUploadComplete:function(file,data,response){
            data = eval("("+data+")");
            if(data["error"] == 0){
					var this_img = $("#img").find("img");
                    this_img.attr("src", data.url)
                }
			console.log('complete.');
        },
		onDelete:function(file){
			console.log('删除的文件：'+file);
			console.log(file);
		},
        onUploadError: function (file) {
			console.log('error');
            console.log(file);
        }
		});
});