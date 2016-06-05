require('common/common.js');
require('common/fileinput.js');
require('common/summernote.js');
require('common/jquery.datetimepicker.js');

//jQuery(document).ready(function($) {
    pageinit(); 
//});

function pageinit(){
     $("#imagefile").fileinput({
        language:'zh',
        showCaption: true,
        browseClass: "btn btn-ls",
        uploadUrl:"http://localhost:3000/harvey/v1/secret/product/initfile",
        showUpload: true,
        slugCallback: function(filename) {
            return filename.replace('(', '_').replace(']', '_');
        }
    });

    
   $('#date_timepicker_start').datetimepicker({

        onShow:function( ct ){
            this.setOptions({
                maxDate:$('#date_timepicker_end').val()?$('#date_timepicker_end').val():false
            })
        },
        lang:"ch"
        /*format:'Y/m/d',
         timepicker:false*/
    });
    $('#date_timepicker_end').datetimepicker({

        onShow:function( ct ){
            this.setOptions({
                minDate:$('#date_timepicker_start').val()?$('#date_timepicker_start').val():false
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
        focus: true                 // set focus to editable area after initializing summernote

    });
}


