require('common/common.js');
require('common/fileinput.js');
require('common/summernote.js');
require('common/jquery.datetimepicker.js');

jQuery(document).ready(function($) {
    pageinit(); 
});

var publicurl="http://localhost:3000";
function pageinit(){
    $("#saveProduct").click(function(){
      saveProduct();
    });
    $("#saveProductDesc").click(function(){
      //$('#searchpanel').toggle();
      saveProductDesc();
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
    $("#provinceno").change(initCity);
    $("#cityno").change(initCounty);
    $("#categoryno").change(initSubclass);
    initCategory();
}

function initCity(event){
   var proviceid=$(this).val();
   if(proviceid==0){return;}
    $.ajax({
        url:'http://localhost:3000/harvey/v1/city',
        type :'get',
        contentType :"application/json",
        cache : false,
        data:{proviceid:proviceid},
        dataType : 'json',
        success:function(res){
        if(res.result.code='200'&&res.list.length>0){
            var citys=res.list;
            var tablehtml='<option value="0">--地级市--</option>';
            for (var i = 0;i<citys.length;i++) {
                    var city=citys[i];
                     tablehtml+='<option value="'+city.city_id+'">'+city.city_name+'</option>';
            }
            $("#cityno").html(tablehtml);
        }
        }
    })
}


function initCounty(event){
   var cityid=$(this).val();
   if(cityid==0){return;}
    $.ajax({
        url:'http://localhost:3000/harvey/v1/county',
        type :'get',
        contentType :"application/json",
        cache : false,
        data:{cityid:cityid},
        dataType : 'json',
        success:function(res){
        if(res.result.code='200'&&res.list.length>0){
            var countys=res.list;
            var tablehtml='<option value="0">--县级市--</option>';
            for (var i = 0;i<countys.length;i++) {
                    var county=countys[i];
                     tablehtml+='<option value="'+county.county_id+'">'+county.county_name+'</option>';
            }
            $("#countyno").html(tablehtml);
        }
    
        }
    })
}

function initCategory(){
    $.ajax({
        url:'http://localhost:3000/harvey/v1/categoryno',
        type :'get',
        contentType :"application/json",
        cache : false,
        dataType : 'json',
        success:function(res){
        if(res.result.code='200'&&res.list.length>0){
            var categorys=res.list;
            var tablehtml='<option value="0">--产品类型--</option>';
            for (var i = 0;i<categorys.length;i++) {
                    var category=categorys[i];
                     tablehtml+='<option value="'+category.id+'">'+category.category_name   +'</option>';
            }
            $("#categoryno").html(tablehtml);
        }
        }
    })
}


function initSubclass(event){
   var categoryid=$(this).val();
   if(categoryid==0){return;}
    $.ajax({
        url:'http://localhost:3000/harvey/v1/subclassno',
        type :'get',
        contentType :"application/json",
        cache : false,
        data:{categoryid:categoryid},
        dataType : 'json',
        success:function(res){
        if(res.result.code='200'&&res.list.length>0){
            var subclasses=res.list;
            var tablehtml='<option value="0">--产品子类型--</option>';
            for (var i = 0;i<subclasses.length;i++) {
                    var subclass=subclasses[i];
                     tablehtml+='<option value="'+subclass.id+'">'+subclass.content+'</option>';
            }
            $("#subclassno").html(tablehtml);
        }
    
        }
    })
}

function sendFile(file, editor, $editable){
    var filename = false;
    try{
    filename = file['name'];
    } catch(e){
        filename = false;
    }
    if(!filename){$(".note-alarm").remove();}
    //以上防止在图片在编辑器内拖拽引发第二次上传导致的提示错误
    var ext = filename.substr(filename.lastIndexOf("."));
    ext = ext.toUpperCase();
    var timestamp = new Date().getTime();
    var name = timestamp+"_"+$("#summernote").attr('aid')+ext;
    //name是文件名，自己随意定义，aid是我自己增加的属性用于区分文件用户
    var formdata = new FormData();
    formdata.append("file", file);
    formdata.append("key",name);
    formdata.append("token",$("#summernote").attr('token'));
    $.ajax({
    data: formdata,
    type: "POST",
    url: "http://localhost:3000/harvey/v1/secret/base/uploadfile",
    cache: false,
    contentType: false,
    processData: false,
    success: function(data) {
    //data是返回的hash,key之类的值，key是定义的文件名
    if(200 === data.result.code) {
        editor.insertImage($editable, data.url.replace(/public/,publicurl));
       
      } else {
   
      }
  
    //url-head是自己七牛云的domain
    //$(".note-alarm").html("上传成功,请等待加载");
    //setTimeout(function(){$(".note-alarm").remove();},3000);
    },
    error:function(){
    //$(".note-alarm").html("上传失败");
    //setTimeout(function(){$(".note-alarm").remove();},3000);
    }
    });
}
var productid;
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
    formdata.append("countyno",$("#countyno").val());
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
      if(200 === data.result.code) {
          productid=data.productid;
       $("#productInfo").hide();
       $("#productDecs").show();
      } else {
      
      }
      console.log('product add success, data:', data);
     },
     error: function(){
      $("#spanMessage").html("与服务器通信发生错误");
    }
   });

}

 function saveProductDesc(){
    // var formdata=new FormData();
    var description=  $('.summernote').code();
    // if (description.length<=0) {
    //     alert('contents is empty');
    //  }
    alert(description);
    // formdata.append("context",description);
    // formdata.append("productid",productid);
 
  $.ajax({ 
     url:'http://localhost:3000/harvey/v1/secret/product/addDescription',
     type: 'POST',
     data:  JSON.stringify({
                    productid:productid, context :description
                }),
     dataType: 'json',
     cache: false,
    contentType: 'application/json',
     processData: false,
     success: function(data){
      if(200 === data.result.code) {
        alert("保存成功");
        window.location.href="productManage.html";
      } else {
      
      }
      console.log('product add success, data:', data);
     },
     error: function(){
      $("#spanMessage").html("与服务器通信发生错误");
    }
  });
 }

    //检查参数
        function checkeParam(){
            var file=$("#imagefile")[0].files[0];
            var productName = $("#productName").val(); 
            var categoryno = $("#categoryno").val();
            var subclassno=$("#subclassno").val();
            var price=$("#price").val();
            var pcount=$("#count").val();
            var activityid=$("#activityid").val();
            var begintime=$("#begintime").val();
            var endtime=$("#endtime").val();
            var provinceno=$("#provinceno").val();
            var cityno=$("#cityno").val();
            var address=$("#address").val();
            var abstract=$("#abstract").val();
            if(null == file || undefined == file){
                msg = "请设置产品封面" ;
                $("#suit_cover_msg").html(msg) ;  
                layer.msg(msg) ;
                return false; 
            }else{
                $("#suit_cover_msg").html("") ;  
            }
            
            if(null == productName || undefined == productName || productName.length <= 0){
                msg = "请填写活动标题" ;
                $("#activity_title_msg").html(msg) ;
                layer.msg(msg) ;
                return false;
            }else{
                $("#activity_title_msg").html("") ;
            }
            
            if(null == closingDate || undefined == closingDate || closingDate.length <= 0){
                msg = "请选择报名截止日期" ;
                $("#activity_closingDate_msg").html(msg) ;
                layer.msg(msg) ;
                return false;
            }else{
                $("#activity_closingDate_msg").html("") ;
            }
            
            if(null == startTime || undefined == startTime || startTime.length <= 0){
                msg = "请选择活动开始时间" ;
                $("#activity_startTime_msg").html(msg) ;
                layer.msg(msg) ;
                return false;
            }else{
                $("#activity_startTime_msg").html("") ;
            }
            
            if(null == endTime || undefined == endTime || endTime.length <= 0){
                msg = "请选择活动结束时间" ;
                $("#activity_endTime_msg").html(msg) ;
                layer.msg(msg) ;
                return false;
            }else{
                $("#activity_endTime_msg").html("") ;
            }
            
            //人数限制
            var limitNumber = $("#activity_form").find("input[name='limitNumber']").val() ;
            if(null == limitNumber || undefined == limitNumber || limitNumber.length <= 0){
                msg = "请填写人数限制" ;
                $("#activity_limitNumber_msg").html(msg) ;
                layer.msg(msg) ;
                return false;
            }else{
                $("#activity_limitNumber_msg").html("") ;
            }
            
            var address = $("#activity_form").find("input[name='address']").val() ;
            if(null == address || undefined == address || address.length <= 0){
                msg = "请填写活动地址" ;
                $("#activity_address_msg").html(msg) ;
                layer.msg(msg) ;
                return false;
            }else{
                $("#activity_address_msg").html("") ;
            }
            
            var editor = UE.getEditor('editor');
            var description = editor.getContentTxt() ;
            if(null == description || undefined == description || description.length <= 0){
                msg = "请填写活动详情" ;
                layer.msg(msg) ;
                return false;
            }else{
            }
            
            return true ;
        }