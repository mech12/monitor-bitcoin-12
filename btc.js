'use strict';

var config = require("config");
var Promise = require("bluebird");
var bitcoinRPC = require("node-bitcoin-rpc");
Promise.promisifyAll(bitcoinRPC);

var node_num = process.argv[2];
var cmd = process.argv[3];
var argv = process.argv.splice(4);
var args = argv.length == 0 ? [] : [...argv];

var port = 9112;
if (node_num == 2)
    port = 9122;
else if (node_num == 3)
    port = 9132;


bitcoinRPC.init('test-olle', port, config.get('RPC.rpc_username'), config.get('RPC.rpc_password'));

try {
    var a = bitcoinRPC.callAsync(cmd, args);
    a.then(function(ret) {
            console.log(ret);
            console.log('process.argv=', args);
        })
        .error(function(err) {
            console.error(err);
            console.log('error process.argv=', args);
        });


} catch (err) {
    console.error(err);
    console.log('catch process.argv=', args);
}