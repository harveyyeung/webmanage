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

