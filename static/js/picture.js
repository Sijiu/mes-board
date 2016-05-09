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
        buttonText:'上传图片',//上传按钮上的文字
		uploader:"/picture/upload/local",
		onUploadStart:function(){
			//alert('开始上传');
			},
		onInit:function(){
			//alert('初始化');
			},
		onUploadComplete:function(file,data,response){
            data = eval("("+data+")");
            if(data["error"] == 0){
                var this_img = $("#feed_img").find(".image").eq(images.length);
                if(this_img.length){
                    this_img.attr("src", data.url).attr("draggable","false");
                    images.push(data.url);
                }
            }
        },
		onDelete:function(file){
			console.log('删除的文件：'+file);
			console.log(file);
		},
        onUploadError: function () {
            console.log(file);
        }
		});
});