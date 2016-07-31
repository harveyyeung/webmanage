require('common/bootstrap.min.js');

jQuery(document).ready(function($) {
    pageinit(); 
});

function pageinit(){
    $("#loginbutton").click(function(){
      loginSubmit();
    });
}




function loginSubmit(){

    var formdata={};
    formdata.phone=$("#l_phone").val();
    formdata.password=$("#password").val();
       window.location.href="index.html";
//    $.ajax({ 
//      url:'http://localhost:3000/harvey/v1/secret/user/login',
//      type: 'POST',
//      data:  JSON.stringify(formdata),
//      dataType: 'json',
//      cache: false,
//      contentType: 'application/json',
//      success: function(data){
//       if(200 === data.result.code) {
//          window.location.href="index.html";
//            console.log('user login success, data:', data);
//       } else {
//           console.log('user login fail, data:', data);
//       }
    
//      },
//      error: function(){
//       $("#spanMessage").html("与服务器通信发生错误");
//      }
//    });


}