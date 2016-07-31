require('common/common.js');
require('common/fileinput.js');
require('common/summernote.js');
require('common/jquery.datetimepicker.js');
var utils=require('libs/utils.js');

jQuery(document).ready(function($) {
    var productid=getUrlVars('productid');
    pageinit(productid); 
});

var publicurl="http://localhost:3000";
function pageinit(productid){
    alert(productid);
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
            $("#productName").val(product.name);
            $("#categoryno").val(product.categoryname);
            $("#subclassno").val(product.subclassname);
            $("#price").val(product.price);
            $("#count").val(product.pcount);
            $("#begintime").val(product.begintime);
            //$("#endtime").val(product.endtime);
            $('#endtime').datetimepicker({

                onShow:function( ct ){
                    this.setOptions({
                        minDate:$('#begintime').val()?$('#begintime').val():false
                    })
                },
                lang:"ch",
                value:product.endtime
            });
            $("#provinceno").val(product.provice_name);
            $("#cityno").val(product.city_name);
            $("#countyno").val(product.endtime);
            $("#address").val(product.address);

                      

        
        }
        }
    })
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