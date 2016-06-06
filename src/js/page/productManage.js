require('common/common.js');
jQuery(document).ready(function($) {
   $("#searchbutton").click(function(){$('#searchpanel').toggle();
   getProduct();
   });
});


function getProduct(){
   
   $.ajax({
     url:'http://localhost:3000/harvey/v1/product/list',
     type :'get',
     contentType :"application/json",
     cache : false,
     dataType : 'json',
     success:function(res){
      alert(res);
  
     }
   })

}