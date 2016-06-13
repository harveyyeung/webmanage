'use strict'

var  _ = require('lodash');

var  getCheck = {
    checkEmail: function(val) {
        var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        if (filter.test(val)) {
            return true;
        } else {
            return false;
        }
    },
    checkPhone: function(val) {
        var filter = /^1\d{10}$/;

        if (filter.test(val)) {
            return true;
        } else {
            return false;
        }
    },
    checkString:function(val){
        if(val==null||val==undefined){
            return false;
        }else if(val==""){
            return false;
        }else{
            return true;
        }
        
    }
}


exports.getCheck=getCheck;