require('common/common.js');
require('common/fileinput.js');
require('common/summernote.js');
require('common/jquery.datetimepicker.js');

jQuery(document).ready(function($) {
    pageinit(); 
});

function pageinit(){
    $("#saveProduct").click(function(){$('#searchpanel').toggle();
      saveProduct();
    });
    $("#imagefile").fileinput({
     'language':'zh',
     'showUpload':false,
     'allowedFileExtensions': ["jpg", "png", "gif"],
      'allowedFileTypes':['image']
   });
   
    
   $('#begintime').datetimepicker({

        onShow:function( ct ){
            this.setOptions({
                maxDate:$('#endtime').val()?$('#endtime').val():false
            })
        },
        lang:"ch"
        /*format:'Y/m/d',
         timepicker:false*/
    });
    $('#endtime').datetimepicker({

        onShow:function( ct ){
            this.setOptions({
                minDate:$('#begintime').val()?$('#begintime').val():false
            })
        },
        lang:"ch"
        /*format:'Y/m/d',
         timepicker:false*/
    });
    $('.summernote').summernote({
        height: 400,                 // set editor height
        minHeight: 400,             // set minimum height of editor
        maxHeight: null,             // set maximum height of editor
        focus: true ,                 // set focus to editable area after initializing summernote
        onImageUpload: function(files, editor, $editable) {
          sendFile(files[0],editor,$editable);
        }
    });
}
function sendFile(file, editor, $editable){
var filename = false;
try{
filename = file['name'];
} catch(e){filename = false;}
if(!filename){$(".note-alarm").remove();}
//以上防止在图片在编辑器内拖拽引发第二次上传导致的提示错误
var ext = filename.substr(filename.lastIndexOf("."));
ext = ext.toUpperCase();
var timestamp = new Date().getTime();
var name = timestamp+"_"+$("#summernote").attr('aid')+ext;
//name是文件名，自己随意定义，aid是我自己增加的属性用于区分文件用户
data = new FormData();
data.append("file", file);
data.append("key",name);
data.append("token",$("#summernote").attr('token'));
$.ajax({
data: data,
type: "POST",
url: "http://upload.qiniu.com",
cache: false,
contentType: false,
processData: false,
success: function(data) {
//data是返回的hash,key之类的值，key是定义的文件名
editor.insertImage($editable, $("#summernote").attr('url-head')+data['key']);
//url-head是自己七牛云的domain
$(".note-alarm").html("上传成功,请等待加载");
setTimeout(function(){$(".note-alarm").remove();},3000);
},
error:function(){
$(".note-alarm").html("上传失败");
setTimeout(function(){$(".note-alarm").remove();},3000);
}
});
}



function saveProduct(){
    var formdata=new FormData();
    formdata.append("file",$("#imagefile")[0].files[0]);
    formdata.append("name",$("#productName").val());
    formdata.append("categoryno",$("#categoryno").val());
    formdata.append("subclassno",$("#subclassno").val());
    formdata.append("price",$("#price").val());
    formdata.append("pcount",$("#count").val());
    formdata.append("activityid",$("#activityid").val());
    formdata.append("begintime",$("#begintime").val());
    formdata.append("endtime",$("#endtime").val());
    formdata.append("provinceno",$("#provinceno").val());
    formdata.append("cityno",$("#cityno").val());
    formdata.append("address",$("#address").val());
    formdata.append("abstract",$("#abstract").val());
   $.ajax({ 
     url:'http://localhost:3000/harvey/v1/secret/product/add',
     type: 'POST',
     data: formdata,
     dataType: 'json',
     cache: false,
     contentType: false,
     processData: false,
     success: function(data){
      if(200 === data.code) {
        $("#imgShow").attr('src', data.msg.url);
        $("#spanMessage").html("上传成功");
      } else {
        $("#spanMessage").html("上传失败");
      }
      console.log('imgUploader upload success, data:', data);
     },
     error: function(){
      $("#spanMessage").html("与服务器通信发生错误");
    }
   });

}