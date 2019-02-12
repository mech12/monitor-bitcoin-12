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

    return g_G;

}