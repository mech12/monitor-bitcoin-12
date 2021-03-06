'use strict';

const g_G = require('./g_G').g_G;
var config = require("config");

const Client = require('bitcoin-core');
const sb = require('satoshi-bitcoin');
(async function() {
    await g_G.calcCurrentBitcoinFees();

    try {

        const config = {
            host: 'localhost',
            //host: 'test-olle',
            port: 9112,
            username: 'bitcoinrpc',
            password: process.env.OLLE_RPC_PASS,
            //headers: true ,
            //작동안함 wallet : '/Users/roy/wallet.dat',
        }
        const client = new Client(config);
        await test_api(client);
        //await test_sendMany(client);
        //await test_fee(client);
        await test_op_return(client);


    } catch (err) {
        g_G.error(err);
        g_G.log('catch process.argv', process.argv);
    }

    //g_G.log('process.argv=', args);

})();



async function test_op_return(btc) {
    g_G.log('=========  test_op_return    =========');
    var ret = await btc.listUnspent();

    var utxo = ret.find(t => {
        return t.amount > g_G.VAR.MIN_AMOUNT && t.confirmations >= g_G.VAR.MIN_confirmations;
    });
    if(utxo==null){
        g_G.error('utxo==null listunspent length=',ret.length);
        return;
    }
    g_G.log('listunspent length= ', ret.length, 'utxo=', utxo);

    // var op_return_data = "fe7f0a3b69f56ef2d055a78823ed3bd1422e46c3183658ea854253033ae0ccef";
    // var fee = g_G.get_btc_fee_P2PKH(1,2);

    // var op_return_data = 1k
    // var fee = g_G.get_btc_fee_P2PKH(1,2);
    // 17b26358a0359e2368993f030e5ef5f7e1b9ab260a868c64d46c7ac6b5050d58


    // var op_return_data = 2k
    // var fee = g_G.get_btc_fee_P2PKH(1,4);
    //43d155461bf5a8cd0e9cb82d3e46430ee0f10c08722112a31ac444613f7fd23a

    // var op_return_data = 5k
    // var fee = g_G.get_btc_fee_P2PKH(1,6);
    // 04f807984f1fa4870deff3b0e334b95af596b2e5c39f88ce97c1faac70b0bab4

    // var op_return_data = 10k
    // var fee = g_G.get_btc_fee_P2PKH(1,10);
    // 2496af672cb3ed4c6c4866286deda06c66a5609d2d651e2017c52ee1dcb16fbb

    let txt = "[{code:'a000', 생산자:'roy' },{code:'a000', 생산자:'roy' },{code:'a000', 생산자:'roy' },{code:'a000', 생산자:'roy' },{code:'a000', 생산자:'roy' },{code:'a000', 생산자:'roy' },{code:'a000', 생산자:'roy' },{code:'a000', 생산자:'roy' },{code:'a000', 생산자:'roy' },{code:'a000', 생산자:'roy' },{code:'a000', 생산자:'roy' }]";
    var org = Buffer.from(txt).toString('hex');
    var str = Buffer.from(org.toString(), 'hex').toString('utf8');
    if (txt != str) {
        g_G.log(' org text=', str);
        return g_G.error('txt!=str');
    }
    var op_return_data = org;
    //var fee = g_G.get_btc_fee_P2PKH(1, 2);
    var fee = g_G.get_btc_fee_P2PKH(1, 1);


    var inputs = [{ txid: utxo.txid, vout: utxo.vout }];
    var outputs = { data: op_return_data }



    //outputs[config.get('RPC.colored_address')] = g_G.VAR.olle_fee;
    //outputs['1LXZp1j9U6VBUfKvqYtFrpDhE5r1LFijw1'] = g_G.VAR.olle_fee;

    // // var newAddr2 = await btc.getRawChangeAddress();

    var newAddr = await btc.getRawChangeAddress();
    var newAddr2 = await btc.getRawChangeAddress();
    outputs[newAddr2] = g_G.VAR.olle_fee;
    let amount = utxo.amount - (fee.BTC + g_G.VAR.olle_fee);
    let sat = parseInt(sb.toSatoshi(amount));
    let _btc = sb.toBitcoin(sat);
    outputs[newAddr] = _btc;

//    g_G.log('utxo.amount = ', utxo.amount);
    g_G.log('fee.BTC = ', fee.BTC);
    g_G.log('sat = ', sat,'btc =', _btc);

    var raw_tx = await btc.createRawTransaction(inputs, outputs);
    //g_G.log('createRawTransaction =', raw_tx);
    var sign_raw_tx = await btc.signRawTransaction(raw_tx);
    if (sign_raw_tx.complete != true) {
        return g_G.error("FAILED : signRawTransaction = ", sign_raw_tx);
    }
    //g_G.log('signRawTransaction =', sign_raw_tx.hex);

    //var ret = await btc.decodeRawTransaction(sign_raw_tx.hex);
    //g_G.log('decodeRawTransaction =', ret);

    var ret = await btc.sendRawTransaction(sign_raw_tx.hex);
    g_G.log('OK sendRawTransaction =', ret);

}




async function test_fee(btc) {
    g_G.log('=========  test_fee    =========');
    var ret = g_G.get_btc_fee_P2PKH(1, 2);
    g_G.log("test_fee = ", ret);
}


async function test_sendMany(client) {
    g_G.log('=========  test_sendMany    =========');
    const batch = [
        { method: 'getnewaddress', parameters: [] },
        { method: 'getnewaddress', parameters: [] }
    ]

    var addr1, addr2;
    [addr1, addr2] = await client.command(batch);
    g_G.log(addr1, addr2);

    var toAddr = {}
    toAddr[addr1] = 0.1;
    toAddr[addr2] = 0.2;
    var ret = await client.sendMany('mech12', toAddr, 1, 'Example Transaction');
    g_G.log('sendMany = ', ret);

    // => cde2f459fc1e3ac068b9e79d2301b4589825d31759647831bb031916b7059f8e

}

async function test_api(client) {
    g_G.log('=========  test_api    =========');

    const batch = [
        { method: 'getblockchaininfo', parameters: [] },
    ]
    var ret = await client.command(batch);
    g_G.log('getblockchaininfo=', ret);


    var ret = await client.getBlockCount();
    g_G.log('getBlockCount=', ret);

    //btc2 walletpassphrase asdf1234 9999999
    const balance = await client.getBalance('*', 0);
    g_G.log('getBalance=', balance);

    ret = await client.getBalance('mech12', 0);
    g_G.log('getBalance mech12=', ret);
    //ret = await client.walletPassphrase('asdf1234', 9999999);
    //g_G.log('walletPassphrase=', ret);

    ret = await client.listAccounts();
    g_G.log('listAccounts=', ret);

    /*
        client.createRawTransaction([{
            txid: '1eb590cd06127f78bf38ab4140c4cdce56ad9eb8886999eb898ddf4d3b28a91d',
            vout: 0
        }], {
            'mgnucj8nYqdrPFh2JfZSB1NmUThUGnmsqe': 0.13
        });
        client.sendMany('test1', {
            mjSk1Ny9spzU2fouzYgLqGUD8U41iR35QN: 0.1,
            mgnucj8nYqdrPFh2JfZSB1NmUThUGnmsqe: 0.2
        }, 6, 'Example Transaction');
        client.sendToAddress('mmXgiR6KAhZCyQ8ndr2BCfEq1wNG2UnyG6', 0.1,
            'sendtoaddress example', 'Nemo From Example.com');


    */
    /*
    var txid = 'cde2f459fc1e3ac068b9e79d2301b4589825d31759647831bb031916b7059f8e';
    ret = await client.getTransactionByHash(txid);
    g_G.log('getTransactionByHash= ',ret);
    */



}