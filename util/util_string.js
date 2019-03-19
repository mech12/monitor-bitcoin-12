'use strict'

const fs = require('fs');
const async = require('async');

exports.Init = async function(g_G) {

    // str에  strList에 있는 스트링이 포함 되어있다면 true
    g_G.isContainString = (str, strList) => {

        var ret = strList.filter(_url => { return str.indexOf(_url) != -1; });
        return ret.length > 0;
    }
    
    g_G.IsValidEmailAddress = function(inputStr) {
        return new RegExp(/^[a-z0-9_+.-]+@([a-z0-9-]+\.)+[a-z0-9]{2,4}$/i).test(inputStr);
    }

    g_G.replaceAll = function(str, find, replace) {
        return str.replace(new RegExp(find, 'g'), replace);
    }


}