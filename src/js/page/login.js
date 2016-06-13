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


   window.location.href="index.html";

}