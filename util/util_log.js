const format = require('util').format;
//var clog = require('clog');
const moment = require('moment');

/*!
 * Clog - Colorful console output for your applications in NodeJS
 *
 * Copyright(c) 2012 Firejune <to@firejune.com>
 * MIT Licensed
 */


/**
 * Object to array
 */

function toArray(enu) {
    var arr = [];

    for (var i = 0, l = enu.length; i < l; i++)
        arr.push(enu[i]);

    return arr;
}

function extendObject(destination, source) {
    for (var property in source)
        destination[property] = source[property];

    return destination;
}


/**
 * Clog environments.
 */

var version = '0.1.5'


    /**
     * Colors of log types.
     *
     * Black       30
     * Blue        34
     * Green       32
     * Cyan        36
     * Red         31
     * Purple      35
     * Brown       33
     * Light Gray  37
     *
     */
    ,
    colors = {
        'log': 0,
        'error': 31,
        'warn': 33,
        'info': 36,
        'debug': 90,
        'roy': 35,
        'alpa44': 37,
    }

    ,
    levels = {
        'log': true,
        'info': true,
        'warn': true,
        'error': true,
        'debug': true,
    };


/**
 * Clog class.
 */

var Clog = function() {

    /**
     * Generate methods.
     */

    var self = this;
    for (var name in colors) {
        this.log[name] = (function(name) {
            return function() {
                self.log.apply(self, [name].concat(toArray(arguments)));
            }
        })(name);
    }

    this.log.configure = function(config) {
        return self.configure.apply(self, [config]);
    };

    return this.log;
};


/**
 * Configure method.
 */

Clog.prototype.configure = function(config) {
    var level, index = 0;

    if (!config || !(level = config['log level']))
        return 'WTF?';

    if ('object' == typeof level)
        extendObject(levels, level);

    if ('number' == typeof level)
        for (var property in levels) {
            levels[property] = index < level;
            index++;
        }

    return levels;
};


/**
 * Log method.
 */

Clog.prototype.log = function(type, msg) {
    var msgIsString = typeof(msg) == 'string';
    var col = colors[type];
    var col_txt = '\033[' + col + 'm' + type + ':\033[39m ' + (msgIsString ? msg : '');
    var nocol_txt = '\033[37m' + type + ':' + '\033[39m ' + (msgIsString ? msg : '');
    var arr = [col ? col_txt : nocol_txt];
    var _arg = toArray(arguments).slice(msgIsString ? 2 : 1);
    levels[type] !== false && console.log.apply(
        console, arr.concat(_arg)
    );

    return levels[type];
};


/**
 * Export intance of Clog as the module.
 */

var clog = new Clog;



exports.Init = function(g_G) {

    clog.configure(g_G.clog_config);


    g_G.clog = clog;
    g_G.info = clog.info;
    g_G.log = clog.log;
    g_G.debug = clog.debug;
    if (g_G.SERVICE_ROLE != 'admin 1234') {

        g_G.warn = function(msg) {
            //if (g_G.jRedis && g_G.jRedis.Publish_server_log) g_G.jRedis.Publish_server_log('warn', arguments);
            clog.warn(arguments);
        }
        g_G.error = function(msg) {
            //if (g_G.jRedis && g_G.jRedis.Publish_server_log) g_G.jRedis.Publish_server_log('error', arguments);
            clog.error(arguments);
        }

    } else {
        g_G.warn = clog.warn;
        g_G.error = clog.error;

    }

    /*
     * 
     *      {'log level' : {log: true,info: true,warn: true,error: true,debug: true , test:true} }

     * 
        //clog('server', 'start listening on port 3000');  // custom head
        //clog.configure({ 'log level': { 'server': false } });
    g_G.clog('server', 'start listening on port 3000');  // custom head
    g_G.log('hello', 'world');                      // g_G.log
    g_G.info(['foo', 'bar']);                       // console.info
    g_G.warn('baz is deprecated.');                 // console.warn
    g_G.error('HTTP/1.1 400 Bad Request');          // console.error
    g_G.debug('headers', {                          // console.debug
        'Content-Type': 'text/javascript'
    });
    */


    // redis.multi() 캣치용 async & await 용 에러처리 함수.
    g_G.awaitCatchRED = (errTag) => {
        return (ret) => {
            if (Array.isArray(ret) == false) {
                throw new Error(errTag + ' ret != array');
            }
            ret.find(r => {
                if (r.constructor.name == 'ReplyError') {
                    throw new Error(errTag + ' ' + r);
                }
                return false;
            });
        }
    }

    // async & await 캣치용 함수.
    g_G.awaitCatch = (errTag) => {
        return (e) => { throw new Error(errTag + '<=' + e); }
    }


} //exports.Init = function (g_G)