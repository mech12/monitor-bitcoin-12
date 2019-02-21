'use strict'

const fs = require('fs');
const async = require('async');

exports.Init = function(g_G) {


    g_G.ValidateIPaddress = (ipaddress) => {
        /*
        console.log("true ValidateIPaddress('12.2.2.2') = " ,ValidateIPaddress('12.2.2.2') ) 
        console.log("false ValidateIPaddress('12.2sdfadfs.2.2') = " ,ValidateIPaddress('12.asdf2.2.2') )
        console.log("false ValidateIPaddress('2212.2.2.2') = " ,ValidateIPaddress('2212.2.2.2') )
        */
        if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress)) {
            return (true)
        }
        return (false)
    }

    /*
    g_G.getClientIP = function(req) {
        return (req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress || '').split(',')[0].trim();
    }
    */


    g_G.getClientIP = function(req) {
        return req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;
    }

    g_G.get_client_ip = g_G.getClientIP;


}