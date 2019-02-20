'use strict';

var router = require("express").Router();
var config = require("config");
var Promise = require("bluebird");
var bitcoinRPC = require("node-bitcoin-rpc");
var os = require("os");
Promise.promisifyAll(bitcoinRPC);
var getSize = require('nodejs-fs-utils').fsize;
Promise.promisifyAll(getSize);
const request = require('request');


let pass = process.env.OLLE_RPC_PASS; //config.get('RPC.rpc_password')
bitcoinRPC.init(config.get('RPC.host'), config.get('RPC.port'), config.get('RPC.rpc_username'), pass);

router.get("/status", function(req, res) {
    var info = {
        arch: os.arch(),
        cpus: os.cpus(),
        freemem: os.freemem(),
        uptime: os.uptime(),
        totalmem: os.totalmem(),
        platform: os.platform(),
        release: os.release(),
        hostname: os.hostname(),
        networkInterfaces: os.networkInterfaces(),
        loadavg: os.loadavg()
    };
    getSize(process.env.OLLE_BITCOIN_HOME, function(error, size) {
        if (!error) {
            info.blockchainSize = size;
            res.status(200).json(info).end();
        } else res.status(400).json(error).end();
    });
});

config.get('Api.restCalls').forEach(function(entry) {

    router.get(entry.uri, function(req, res) {
        var inputString = [];
        if (entry.inputType === 'string') {
            inputString.push(req.params[entry.inputName]);
        } else if (entry.inputType === 'number') {
            inputString.push(Number(req.params[entry.inputName]));
        }
        if (typeof entry.verbose === 'boolean') {
            if (entry.inputType === 'number') entry.verbose = Number(entry.verbose);
            inputString.push(entry.verbose);
        }
        if (entry.timeout) {
            bitcoinRPC.setTimeout(entry.timeout);
        }
        bitcoinRPC.callAsync(entry.callName, inputString)
            .then(function(value) {
                res.status(200).json(value.result).end();
            })
            .error(function(error) {
                res.status(200).json({ status: "error", error: error.toString() }).end();
            });
    })
});
router.get('/eOLLE_READ_LOT', function(req, res) {
    const txid = req.query.txid;
    const _id = req.query._id;
    var url = `http://localhost:10001/api/v3/eOLLE_READ_LOT?txid=${txid}&_id=${_id}`;

    //g_G.log('eOLLE_READ_LOT = ' + url);

    request.get({ url: url, json: true },
        function(err, resp, body) {
            console.log('roy', 'err=', err, 'body=', body);
            if (err) return res.status(200).json({ error: err }).end();

            res.status(200).json(body).end();
        });
})

module.exports = router;
