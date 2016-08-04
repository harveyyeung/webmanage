require('common/common.js');
require('common/fileinput.js');
require('common/summernote.js');
require('common/jquery.datetimepicker.js');
var utils=require('libs/utils.js');

jQuery(document).ready(function($) {
    var productid=getUrlVars('productid');
    pageinit(productid); 
});

var publicurl="http://localhost:3000/";
function pageinit(productid){
    alert(productid);
    $("#saveProduct").click(function(){
      saveProduct();
    });
    $("#saveProductDesc").click(function(){
      //$('#searchpanel').toggle();
      saveProductDesc();
    });
    
//     $("#imagefile").fileinput({
//      'language':'zh',
//      'showUpload':false,
//      'allowedFileExtensions': ["jpg", "png", "gif"],
//       'allowedFileTypes':['image']
//    });

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
    initProductInfo(productid);
}

function initProductInfo(productid){
   if(productid==null){return;}
    $.ajax({
        url:'http://localhost:3000/harvey/v1/product/query',
        type :'get',
        contentType :"application/json",
        cache : false,
        data:{productid:productid},
        dataType : 'json',
        success:function(res){
        if(res.result.code='200'&&res.products.length>0){
            var product =res.products[0];
            $("#productId").val(product.id);
            $("#productName").val(product.name);
            $("#categoryno").val(product.categoryname);
            $("#subclassno").val(product.subclassname);
            $("#price").val(product.price);
            $("#count").val(product.pcount);
            $("#begintime").val(product.begintime);
            $("#endtime").val(product.endtime);
            $("#provinceno option[value="+product.provinceno+"]").attr("selected", true);
            $("#cityno").val(product.city_name);
            $("#countyno").val(product.endtime);
            $("#address").val(product.address);
            $("#abstract").val(product.abstract);
            $('.summernote').code(product.content);
           var imageurl=product.url.replace(/public/, publicurl);
           $("#imagefile").fileinput( {
                'language':'zh',
                'showUpload':false,
                'allowedFileExtensions': ["jpg", "png", "gif"],
                'allowedFileTypes':['image'],
                'initialPreview': ["<img src='" +imageurl + "' class='file-preview-image' style='width:180px'>" ],
                'initialPreviewConfig': [{'width':'180px'}]
            });
            
        }
        }
    })
}


function updateProduct(){
    var formdata=new FormData();
    formdata.append("id",$("#productId").val());
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
        url:'http://localhost:3000/harvey/v1/secret/product/update',
        type: 'POST',
        data: formdata,
        dataType: 'json',
        cache: false,
        contentType: false,
        processData: false,
        success: function(data){
        if(200 === data.result.code) {
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


 function updateProductDesc(){
    var description=  $('.summernote').code();
    var productid=$("#productId").val();
  $.ajax({ 
     url:'http://localhost:3000/harvey/v1/secret/product/updateDescription',
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

 function getUrlVars(name) {
        var vars = [], hash;
        var hashes = window.location.href.slice(
                window.location.href.indexOf('?') + 1).split('&');
        for (var i = 0; i < hashes.length; i++) {
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
        return vars[name];
    }