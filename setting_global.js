'use strict';


exports.Init = function() {
    const SERVICE_MODE = process.env.SERVICE_MODE;
    if (SERVICE_MODE == null) SERVICE_MODE = 'live';

    var g_G = {
        appName:'olle-web',
        MODEL: {}, // mongoose model list
        SCHEMA: {}, // mongoose schema list

        VAR: {
            MIN_AMOUNT: 0.131,
            BTC_fee: 14, // g_G.calcCurrentBitcoinFees()에 의해 재계산됨.
            //{ fastestFee: 14, halfHourFee: 14, hourFee: 8 }
            MIN_confirmations: 1,
            olle_fee: 0.00001012,
        },
        ENV: {
            queue_endpoint: { redis: { port: 10020, host: 'localhost', password: '12ships$' } },

        }
    };
    g_G.log = console.log;
    g_G.error = console.error;
    g_G.warn = console.warn;

    //https://www.npmjs.com/package/bitcoin-util-fee
    const bitcoinfees = require('bitcoinfees-21co');
    const feeutil = require('bitcoin-util-fee');
    g_G.get_btc_fee_P2PKH = (number_of_input, number_of_output) => {
        // const getCurrentFees = async () =>
        //     bitcoinfees.FeesApi.recommended().then(res => res.fastestFee)

        const process = () => {
            const satoshi = feeutil.p2pkh_tx_calc_fee(number_of_input, number_of_output)
            console.log("P2PKH fee %d satoshi : %f BTC", satoshi, satoshi / 100000000);
            return { satoshi: satoshi, BTC: satoshi / 100000000 };
        }

        feeutil.BASE_SATOSHI_PER_BYTE = g_G.VAR.BTC_fee; // initialize satoshi/byte rate
        return process();

    }

    g_G.get_btc_fee_P2SH_nm_sign = (number_of_input, number_of_output, n, m) => {

        const process = () => {
            const p2sh_tx_calc_fee_2of3 = feeutil.p2sh_tx_calc_fee_create(n, m);
            const satoshi = p2sh_tx_calc_fee_2of3(number_of_input, number_of_output)
            console.log("2of3 multisig fee %s satoshi", satoshi)
            return { satoshi: satoshi, BTC: satoshi / 100000000 };
        }
        feeutil.BASE_SATOSHI_PER_BYTE = g_G.VAR.BTC_fee; // initialize satoshi/byte rate
        return process()
    }

    g_G.calcCurrentBitcoinFees = async () => {
        //   var res = await bitcoinfees.FeesApi.recommended();
        // g_G.log('=============================================');
        //   g_G.log('bitcoinfees.FeesApi.recommended = ',res);
        // g_G.log('=============================================');

        //   g_G.VAR.BTC_fee = res.fastestFee;
    }

    return g_G;

}