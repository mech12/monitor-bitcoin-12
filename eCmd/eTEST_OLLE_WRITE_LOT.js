'use strict'
const express = require('express');
const router = express.Router();

var config = require("config");
const sb = require('satoshi-bitcoin');

// postman URL
// https://www.getpostman.com/collections/fdd12b3bbc0d3bd588fd


var eCmd = {
    router: router,
    rsLog: false, //  result(rs)값 로그출력여부.
    //rsLog : (rs)=>{ return rs;}, //  로그에 저장할 결과(rs)를 수정하고자 할때

    //name : api명이 세팅된다. 
    //path : 모듈 path name이 세팅된다.
};

router.post('/', /*g_G.auth.isAuthenticated(), */ async (req, res, next) => {
    let [jReq, rq, rs, user] = g_G.paramInit(eCmd, req, res, next); //[jRequestInfo, 요청값, 응답컨테이너]
    if (jReq == null) return g_G.SendError(jReq, 'SERVER_IS_MAINTENANCE : try again later.');

    if (g_G.paramCheckString(jReq, 'data')) return;
    //if (g_G.paramCheckString(jReq, 'uid')) return;
    //if (g_G.paramCheckString(jReq, 'uid')) return;

    (async function(CB) {
        try {
            //=============================================================
            //code begin
            //=============================================================
            const btc = g_G.bitcoinClient;
            let txt = JSON.stringify(rq.data);

            var ret = await btc.listUnspent();
            var utxo = ret.find(t => {
                return t.amount > g_G.VAR.MIN_AMOUNT && t.confirmations >= g_G.VAR.MIN_confirmations;
            });
            if (utxo == null) {
                g_G.error('utxo==null listunspent length=', ret.length);
                return;
            }
            g_G.log('listunspent length= ', ret.length, 'utxo=', utxo);
            rs.utxo = utxo;

            var op_return_data = Buffer.from(txt).toString('hex');
            if (g_G.SERVICE_MODE == 'dev') {
                var str = Buffer.from(op_return_data.toString(), 'hex').toString('utf8');
                if (txt != str) {
                    g_G.log(' op_return_data text=', str);
                    return g_G.error('txt!=str');
                }
            }
            //var fee = g_G.get_btc_fee_P2PKH(1, 2);
            var fee = g_G.get_btc_fee_P2PKH(1, 1);

            var inputs = [{ txid: utxo.txid, vout: utxo.vout }];
            var outputs = { data: op_return_data }

            var newAddr = await btc.getRawChangeAddress();
            var newAddr2 = await btc.getRawChangeAddress();
            outputs[newAddr2] = g_G.VAR.olle_fee;
            let amount = utxo.amount - (fee.BTC + g_G.VAR.olle_fee);
            let sat = parseInt(sb.toSatoshi(amount));
            let _btc = sb.toBitcoin(sat);
            outputs[newAddr] = _btc;
            rs.fee = fee.BTC;

            var raw_tx = await btc.createRawTransaction(inputs, outputs);
            var sign_raw_tx = await btc.signRawTransaction(raw_tx);
            if (sign_raw_tx.complete != true) {
                return g_G.error("FAILED : signRawTransaction = ", sign_raw_tx);
            }
            //g_G.log('signRawTransaction =', sign_raw_tx.hex);

            //var ret = await btc.decodeRawTransaction(sign_raw_tx.hex);
            //g_G.log('decodeRawTransaction =', ret);

            rs.result = await btc.sendRawTransaction(sign_raw_tx.hex);
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

