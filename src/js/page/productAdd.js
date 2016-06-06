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
        focus: true                 // set focus to editable area after initializing summernote

    });
}


function saveProduct(){
    var formdata=new FormData();
    formdata.append("file",$("#imagefile")[0].files[0]);
    formdata.append("productname","123");
   
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