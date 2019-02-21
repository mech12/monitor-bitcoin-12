'use strict'
var assert = require('assert');
const async = require('async');
const path = require('path');


// ------------------------------------------------------------------
// jGlobal function
// ------------------------------------------------------------------
exports.Init = (config) => {
    var g_G = require(config.globalVar).Init();
    exports.g_G = g_G;
    require('./jGlobal_util').Init(g_G);

    g_G.rootDir = config.rootDir;

    if (config.loadingPath)
        g_G.load_modules(config.loadingPath, config.loadingPattern);

    if (process.env.SERVICE_ROLE != null) {
        g_G.SERVICE_ROLE = process.env.SERVICE_ROLE;
    }


    if (process.env.SERVICE_MODE != null) {
        g_G.SERVICE_MODE = process.env.SERVICE_MODE;
    }

    if ('SERVER_REGION' in process.env) {
        g_G.SERVER_REGION = process.env.SERVER_REGION;
    }


    console.info('---------------------------------------------------');
    console.info('g_G.SERVICE_MODE = ', g_G.SERVICE_MODE, 'SHIPS_ENV_HOME=' + process.env.SHIPS_ENV_HOME);
    console.info('---------------------------------------------------');

    /*

    SERVICE_MODE는 다음과 같다.

    dev     : 기본 로컬에 서버와 디비를 뛰울때 사용하는 설정. ( 백엔드 개발자용 )

    test    : aws에 올라가 있는 테스트 서버 설정 ( 프런트엔드 개발자들이 사용 ) 
              기존의 test.12ships.com 설정.

    qa      : live에 올리기 직전 qa검수를 위한 서버 설정. 
              현제는 test 서버와 같이 사용. 차후 추가될 모드이다. 

    live    : 실제 서비스중인 서버 설정.

    dev_roy , dev_martin ... : 개발자별 다른 세팅을 위해 추가된 모드.

    */

    if (config.settingFilePath)
        require(config.settingFilePath + '/setting_' + g_G.SERVICE_MODE).Init(g_G);

    g_G.SERVER_PRIVATE_IP = require('my-local-ip')();

    return g_G;
}