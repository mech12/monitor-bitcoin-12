

'use strict'
const express = require('express');
const router = express.Router();
const _async = require('async');

// postman URL
// https://www.getpostman.com/collections/fdd12b3bbc0d3bd588fd


var eCmd = {
    router: router,
    rsLog: false, //  result(rs)값 로그출력여부.
    //rsLog : (rs)=>{ return rs;}, //  로그에 저장할 결과(rs)를 수정하고자 할때

    //name : api명이 세팅된다. 
    //path : 모듈 path name이 세팅된다.
};

router.get('/', /*g_G.auth.isAuthenticated(), */ async (req, res, next) => {
    let [jReq, rq, rs, user] = g_G.paramInit(eCmd, req, res, next); //[jRequestInfo, 요청값, 응답컨테이너]
    if (jReq == null) return g_G.SendError(jReq, 'SERVER_IS_MAINTENANCE : try again later.');
    //if (g_G.paramCheckString(jReq, 'uid')) return;
    (async function(CB) {
        try {
            //=============================================================
            //code begin
            //=============================================================


            //=============================================================
            //code end 
            //=============================================================
            return CB(null, null);
        } catch (err) { return CB(err); }

    }((err, ret) => {
        if (err && err != 'skip') return g_G.SendError(jReq, err);
        return g_G.paramSend(jReq);
    }));


});
module.exports = eCmd;
