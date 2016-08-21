require('common/common.js');
var utils=require('libs/utils.js');
jQuery(document).ready(function($) {
   $("#searchbutton").click(function(){$('#searchpanel').toggle();
  
   });
   $("#searchProduct").click(function(){
      getProduct();
   });
   $("#ptbale").on('click','#productOffBtn',productOffEvent);
   $("#ptbale").on('click','#productUpBtn',productUpEvent);
    getProduct();
});

var publicurl="http://localhost:3000";
function getProduct(){
   var params={};
   var sProductName=$("#sProductName").val();
   if(utils.getCheck.checkString(sProductName)){
     params.sProductName=sProductName;
   }
    var sProductState=$("#sProductState").val();
   if(sProductState!=0){
     params.sProductState=sProductState;
   }
   var  sProvinceno=$("#sProvinceno").val();
   if(sProvinceno!=0){
     params.sProvinceno=sProvinceno;
   }
   
   $.ajax({
     url:'http://localhost:3000/harvey/v1/product/list',
     type :'get',
     contentType :"application/json",
     cache : false,
     data:params,
     dataType : 'json',
     success:function(res){
      if(res.result.code=='200'&&res.products.length>0){
           var products=res.products;
           var tablehtml="";
           for (var i = 0;i<products.length;i++) {
                var product=products[i];
                tablehtml+="<tr>";
                tablehtml+="<td>"+product.id+"</td>";
                tablehtml+='<td class="text-center"><img class="img-rounded" style="width: 100px;height: 100px;" src="'+product.url.replace(/public/,publicurl)+'"></td>';
                tablehtml+='<td>'+product.name+'</td>';
                tablehtml+='<td>'+product.categoryname+'</td>';
                 tablehtml+='<td>'+product.subclassname+'</td>';
                tablehtml+='<td>'+product.price+'</td>';
                tablehtml+='<td>'+product.begintime+'</td>';
                tablehtml+='<td>'+product.endtime+'</td>';
                tablehtml+='<td class="ls-table-progress">'+
                '<div class="progress progress-striped active">'+
                '<div class="progress-bar progress-bar-success" role="progressbar" aria-valuetransitiongoal="20" aria-valuenow="20" style="width: 20%;">20%</div>'+
                '</div>'+
                '</td>';
                 tablehtml+='<td>'+product.activityid+'</td>';
                tablehtml+='<td class="text-center">'+
                '<button class="btn btn-xs btn-success" title="查看详情"><i class="fa fa-eye"></i></button>'+
                '<button class="btn btn-xs btn-warning " title="编辑" onclick="editProductDetail(\''+product.id+'\')"><i class="fa fa-pencil-square-o"></i></button>';
                if(product.state==1){
                    tablehtml+='<button class="btn btn-xs btn-danger productOffBtn" id="productOffBtn" date-product="'+product.id+'"  title="下架"><i class="fa  fa-arrow-down"></i></button>';
                }else if (product.state==2){
                    tablehtml+='<button class="btn btn-xs btn-primary productUpBtn" id="productUpBtn" date-product="'+product.id+'"  title="上架"><i class="fa  fa-arrow-up"></i></button>';
                }
                 tablehtml+= '</td>'+
                 '</tr>';
           }
           $("#ptbale").html(tablehtml);

      }
  
     }
   })

}

function  productOffEvent(event){
   var that=this;
   var productid=$(that).attr("date-product");
   $.ajax({ 
     url:'http://localhost:3000/harvey/v1/secret/product/off',
     type: 'POST',
     data:  JSON.stringify({productid:productid}),
     dataType: 'json',
     contentType: 'application/json',
     cache: false,
     success: function(data){
      if(200 === data.code) {
            $(that).replaceWith('<button class="btn btn-xs btn-primary" id="productUpBtn" date-product="'+productid+'"  title="下架"><i class="fa fa-arrow-up"></i></button>');
      } else {
      
      }
     },
     error: function(){
      $("#spanMessage").html("与服务器通信发生错误");
    }
   });
}
function  productUpEvent(event){
   var that=this;
   var productid=$(that).attr("date-product");
   $.ajax({ 
     url:'http://localhost:3000/harvey/v1/secret/product/up',
     type: 'POST',
     data:  JSON.stringify({productid:productid}),
     dataType: 'json',
     contentType: 'application/json',
     cache: false,
     success: function(data){
      if(200 === data.code) {
            $(that).replaceWith('<button class="btn btn-xs btn-danger" id="productOffBtn" date-product="'+productid+'"  title="下架"><i class="fa fa-arrow-down"></i></button>');
      } else {
      
      }
     },
     error: function(){
      $("#spanMessage").html("与服务器通信发生错误");
    }
   });
}
window.editProductDetail=function(productid){
  window.location.href="productEdit.html?productid="+productid;
}