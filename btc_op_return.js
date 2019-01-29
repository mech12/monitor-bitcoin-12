'use strict';

global.g_G = require('g_G');

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


const MIN_AMOUNT = 0.01;
const MIN_confirmations = 10;

(async function() {

    try {
        var ret = await bitcoinRPC.callAsync('listunspent', []);
        let utxo = ret.result.find(t => {
            return t.amount > MIN_AMOUNT && t.confirmations >= MIN_confirmations;
        })

        if (utxo == null) return g_G.error('utxo==null');

        var txid = utxo.txid;
        var vout = utxo.vout;
        var amount = utxo.amount;

        ret = await bitcoinRPC.callAsync('getrawchangeaddress', []);
        g_G.log('ret =',ret.result);
        var changeaddress = ret.result;
        g_G.log('txid=', txid, 'vout=', vout, 'amount=', amount,'changeaddress=',changeaddress);





    } catch (err) {
        g_G.error(err);
        g_G.log('catch process.argv=', args);
    }

    //g_G.log('process.argv=', args);

})();