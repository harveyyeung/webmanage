require('common/common.js');
var utils=require('libs/utils.js');

jQuery(document).ready(function($) {
    pageinit(); 
});

var publicurl="http://localhost:3000";
function pageinit(){
    $("#saveCategory").click(function(){
      saveCategory();
    });
    $("#saveSubclass").click(function(){
      saveSubclass();
    });
    $("#delCategoryBtn").click(function(){
      delCategory();
    });
    $("#delSubclassBtn").click(function(){
      delSubclass();
    });
    $("#categoryno").change(initSubclass);
    initCategory();
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
            var tablehtml='';
            for (var i = 0;i<categorys.length;i++) {
               var category=categorys[i];
               tablehtml+='<option value="'+category.id+'">'+category.category_name   +'</option>';
            }
            $("#categoryno").html(tablehtml);
             $("#categoryno").trigger("change");
        
        }
    }

    });
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
        if(res.result.code=='200'&&res.list.length>0){
            var subclasses=res.list;
            var tablehtml='';
            for (var i = 0;i<subclasses.length;i++) {
                    var subclass=subclasses[i];
                    tablehtml+='<option value="'+subclass.id+'">'+subclass.content+'</option>';
            }
            $("#subclassno").html(tablehtml);
        }else{
           $("#subclassno").html("");
        }
    
        }
    })
}

function   saveCategory(){
    var name = $("#categoryName").val();
    if(name==""||name.replace(/(^\s*)|(\s*$)/g, "")){
        alert("请输入产品类型!");
        return false;
    }
   $.ajax({ 
     url:'http://localhost:3000/harvey/v1/secret/category/add',
     type: 'POST',
     data:  JSON.stringify({categoryname:name}),
     dataType: 'json',
     contentType: 'application/json',
     cache: false,
     success: function(data){
      if(200 === data.result.code) {
          $("#categoryName").val("");
          $("#categoryno").append('<option value="'+data.categoryid+'">'+name +'</option>');
          $("#addCategoryBtn").click();    
      } else {
      
      }
     },
     error: function(){
      $("#spanMessage").html("与服务器通信发生错误");
    }
   });

}

 function saveSubclass(){
    var categoryno= $("#categoryno").val();
    var subclassname= $("#subclassName").val();
    if(categoryno==null){
        alert("请选择产品类型");
        return false;
    }
    if(subclassname==""||subclassname.replace(/(^\s*)|(\s*$)/g, "")){
        alert("请输入产品子类型!");
        return false;
    }
    $.ajax({ 
     url:'http://localhost:3000/harvey/v1/secret/subclass/add',
     type: 'POST',
     data:  JSON.stringify({ categoryno:categoryno, subclassname :subclassname}),
     dataType: 'json',
     cache: false,
     contentType: 'application/json',
     success: function(data){
      if(200 === data.code) {
          $("#subclassName").val("");
          $("#subclassno").append('<option >'+subclassname +'</option>');
          $("#addSubclassBtn").click();
      } else {
      
      }
     },
     error: function(){
      $("#spanMessage").html("与服务器通信发生错误");
    }
  });
 }

function   delCategory(){
   var categoryno= $("#categoryno").val();
   $.ajax({ 
     url:'http://localhost:3000/harvey/v1/secret/category/delete',
     type: 'POST',
     data:  JSON.stringify({categoryno:categoryno}),
     dataType: 'json',
     contentType: 'application/json',
     cache: false,
     success: function(data){
      if(200 === data.code) {
           $("#categoryno")[0].remove($("#categoryno")[0].selectedIndex);
           $("#categoryno").trigger("change");
      } else {
      
      }
     },
     error: function(){
      $("#spanMessage").html("与服务器通信发生错误");
    }
   });

}

 function delSubclass(){
    var subclassno= $("#subclassno").val();
    $.ajax({ 
     url:'http://localhost:3000/harvey/v1/secret/subclass/delete',
     type: 'POST',
     data:  JSON.stringify({ subclassno:subclassno}),
     dataType: 'json',
     cache: false,
     contentType: 'application/json',
     success: function(data){
      if(200 === data.code) {
        $("#subclassno")[0].remove($("#subclassno")[0].selectedIndex);

      } else {
      
      }
     },
     error: function(){
      $("#spanMessage").html("与服务器通信发生错误");
    }
  });
 }
