'use strict';

var config = require("config");
var express = require("express");
var app = express();
var morgan = require("morgan");
var bodyParser = require("body-parser");
var api = require("./js/api");
var cluster = require("cluster");
var zmq = require("zeromq")
var sock_zmq = zmq.socket("sub");
var os = require("os");
var server = require("http").createServer(app);
var io = require("socket.io")(server);
var compression = require("compression");
var fs = require("fs");
var path = require("path");
var logFile = path.join(__dirname, "server.log");
var bjs = require('bitcoinjs-lib');
var Promise = require('bluebird');
var Queue = require('simple-promise-queue');
Queue.setPromise(require('bluebird'));
var request = require('request-promise');
var bitcoinRPC = require("node-bitcoin-rpc");
const bitcoinCore = require('bitcoin-core');

var queue = new Queue({
    autoStart: true,
    concurrency: config.get('RPC.concurrency')
});

const rootDir = path.normalize(__dirname);
//console.log('config.rootDir=' , rootDir , '__dirname=',__dirname);
global.g_G = require('./mech12/g_G').Init({
    globalVar: rootDir + '/setting_global',
    
    loadingPath: rootDir + '/util/',
    loadingPattern: 'util_',

    //settingFilePath: rootDir + '/../api/', // setting_<SERVICE_MODE>.js file path 
    rootDir: rootDir,
});

// g_G.backend_server_init((ret, CB) => {
//     g_G.load_modules(rootDir + '/../api/db/', 'db_');
// });
app.use(function(req, res, next) {
    req.__startTime = new Date();
    next() // otherwise continue
})

app.get('/health', function(req, res) { res.sendStatus(200); })
app.use(function(req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    // Pass to next layer of middleware
    next();
});


server.listen(config.get('Web.port'));
app.use(compression());
var accessLogStream = fs.createWriteStream(logFile, { flags: 'a' })
console.log("logging to file: " + logFile);
app.use(morgan("combined", { stream: accessLogStream }));
app.use(bodyParser.json());
console.log("server is now running on port " + config.get('Web.port'));

app.use('/api/', api);
app.use('/', express.static(__dirname + '/static'));

// const matador = require('bull-ui/app')(g_G.ENV.queue_endpoint);
// require('./routes')(app, matador);

if (process.env.NODE_ENV !== 'production') {
    process.once('uncaughtException', function(err) {
        console.error('FATAL: Uncaught exception.');
        console.error(err.stack || err);
        setTimeout(function() {
            process.exit(1);
        }, 100);
    });
}

sock_zmq.connect(config.get('Zmq.socket'));
config.get('Zmq.events').forEach(function(event) {
    sock_zmq.subscribe(event);
});

io.on('connection', function(data) {
    console.log("io.on (connection)");
    //console.log(data);
});

bitcoinRPC.init(config.get('RPC.host'),
    config.get('RPC.port'),
    config.get('RPC.rpc_username'),
    process.env.OLLE_RPC_PASS);

g_G.bitcoinClient = new bitcoinCore({
    host: 'localhost',
    //host: 'test-olle',
    port: 9112,
    username: 'bitcoinrpc',
    password: process.env.OLLE_RPC_PASS,
    //headers: true ,
    //작동안함 wallet : '/Users/roy/wallet.dat',
});


function getFeeOfTx(txid) {
    //returns a promise and fetches tx output value given by index
    return queue.pushTask(function getInputValues(resolve, reject) {
        bitcoinRPC.callAsync('getmempoolentry', [txid])
            .then(function(res) {
                if (res.result == null) {
                    console.error('res.result==null ', res.error.message);
                    return resolve('unkown');
                }
                resolve(res.result.fee * 100000000);
            })
            .catch(function(err) {
                reject(err);
            });
    });
}

sock_zmq.on('message', function(topic, message) {
    
    var events = [
        'hashtx',
        'hashblock',
        'rawtx'
    ];

    g_G.clog('sock_zmq', 'topic = ', topic.toString());//, ' message= ', message);
    events.forEach(function(event) {
        if (topic.toString() === event) {
            if (event === 'rawtx') {
                var txHex = message.toString('hex');
                try {
                    var tx = bjs.Transaction.fromHex(txHex);
                } catch (err) {
                    console.error('initial tx creation from raw hex failed!')
                    console.error(err);
                }
                if (tx.isCoinbase()) {
                    //this is a coinbase tx, no input = no fees
                    return;
                }
                var txid = tx.getId();

                getFeeOfTx(txid)
                    .then(function(fee) {
                        io.emit(topic.toString(), {
                            data: txHex,
                            fee: fee
                        });
                        console.log('fee is ' + fee + ' for txid: ' + txid);
                    })
                    .catch(function(err) {
                        console.error('There was an error during getmempoolentry RPC');
                        console.error('error is: ' + err);
                    });

            } else io.emit(topic.toString(), { data: message.toString('hex') });
        }
    });

    //console.log('received a message related to:', topic.toString(), 'containing message:', message.toString('hex'));
});


g_G.SERVER_IS_MAINTENANCE = 'RUN';

