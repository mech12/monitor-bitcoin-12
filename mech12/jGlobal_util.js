'use strict'

const _ = require('lodash');
const fs = require('fs');
const async = require('async');
const http = require('http');

const format = require('string-format')
format.extend(String.prototype, {});

const moment = require('moment');
moment.createFromInputFallback = function(config) {
    config._d = new Date(config._i);
};

exports.Init = function(g_G) {

    Error.new = function(e) {
        var err = new Error();
        _.extend(err, e);
        return err;
    };

    // 에러로그만 남기는 빈껍대기 callback function
    g_G.null_callback = function(err, result) {
        if (err) g_G.error('g_G.null_callback():' + err);
    }
    g_G.null_CB = g_G.null_callback;


    function _getFileExt(filename) {
        var i = filename.lastIndexOf('.');
        return (i < 0) ? '' : filename.substr(i);
    }


    g_G.load_modules = function(dir, tag) {
        console.log('start load_modules : ', dir);

        var files = fs.readdirSync(dir);

        var log = "[OK] auto loaded module : ";

        files.forEach(function(file, index) {

            if (file.indexOf(" ") > -1) return;

            var testStr = _getFileExt(file);
            if (testStr != '.js') return;

            //if(file.indexOf(tag)==-1) return;

            log += (file + ',\t');
            var v = require(dir + '/' + file);
            if (v == null) {
                console.log("[WARN] not found file :" + file);
                process.exit(1);
            }
            v.Init(g_G);
            []
        });
        console.log(log);
    }


    // ------------------------------------------------------------------
    // eCmd Loading
    // ------------------------------------------------------------------

    //eCmd 파일 로딩.
    g_G.load_eCmd = function(app, cmd_dir , api_url) {
        g_G.log('// ------------------------------------------------------------------');
        g_G.log('// eCmd Loading ');
        g_G.log('// ------------------------------------------------------------------');

        function route_eCmd(app, eCmd, dir) {

            if (eCmd.indexOf(" ") > -1) return;
            var testStr = _getFileExt(eCmd);
            if (testStr != '.js') return;

            var log = (eCmd + ',  ');
            var eCmd_path = dir + '/' + eCmd;
            var v = require(eCmd_path);
            if (v == null) {
                g_G.warn("[WARN] not found file :" + eCmd);
                process.exit(1);
            }

            eCmd = eCmd.replace(".js", "");
            v.path = eCmd_path;
            v.name = eCmd;
            app.use(api_url + eCmd, v.router);
            //g_G.clog(api_url + eCmd + ' is registed ======================  ');
            return log;
        }

        function load_eCmd(dir) {
            g_G.info('load_eCmd : ', dir);
            var log = "[OK] eCmd Loaded : ";
            var files = fs.readdirSync(dir);
            files.forEach(function(file, index) {
                var ret = route_eCmd(app, file, dir);
                if (ret) {
                    log += ret;
                }
            });
            g_G.info(log);
        }

        try {
            cmd_dir.forEach(function(dir) {
                load_eCmd(dir);
            });
        } catch (e) {
            g_G.error(e);
            process.exit(1);
        }

    }


} //exports.Init = function (g_G)