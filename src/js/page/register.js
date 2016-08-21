require('common/bootstrap.min.js');

jQuery(document).ready(function($) {
    pageinit(); 
});

function pageinit(){
    $("#registerbutton").click(function(){
      registerSubmit();
    });
}




function registerSubmit(){
    var formdata={};
    formdata.username=$("#username").val();
    formdata.phone =$("#phone").val();
    formdata.password=$("#password").val();
    formdata.repassword=$("#repassword").val();
   
   $.ajax({ 
     url:'http://localhost:3000/harvey/v1/secret/user/register',
     type: 'POST',
     data:  JSON.stringify(formdata),
     dataType: 'json',
     cache: false,
     contentType: 'application/json',
     success: function(data){
      if(200 === data.result.code) {
         window.location.href="index.html";
      } else {
      
      }
     },
     error: function(){
      $("#spanMessage").html("与服务器通信发生错误");
     }
   });

} 


