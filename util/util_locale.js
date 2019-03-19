'use strict'
const request = require('request')
const csvtojson = require('csvtojson')
const path = require('path');
const fs = require('fs');
const async = require('async');

exports.Init = async function(g_G) {
    g_G.normalizedLocale = function(locale) {
        var ret = 'en';

        switch (locale) {
            case 'kr':
            case 'sp':
            case 'po':
                {
                    ret = locale;
                }
        }
        return ret;
    }


    // 클라이언트와 공유하는 스트링 테이블.
    g_G.getLocaleString = (locale, nic) => {
        var str = _getStringByLocale(locale, nic);
        if (str != null) return str;
        if (locale == 'default') return null;

        str = _getStringByLocale('default', nic);
        if (str != null) return str;
        g_G.clog('locale', 'string is not found :', locale, nic);
        return nic;
    }

    function _getStringByLocale(locale, nic) {

        let requireFromUrl;
        if (requireFromUrl == null) {
            requireFromUrl = require('require-from-url/sync');
            const url = `https://s3.ap-northeast-2.amazonaws.com/12ships-txt/${g_G.SERVICE_MODE}/`;
            g_G.stringTable['ko'] = requireFromUrl(url + "string_ko.js");
            if (g_G.stringTable['ko'] == null) console.error(' g_G.stringTable ko fail');

            g_G.stringTable['default'] = requireFromUrl(url + "string_default.js");
            if (g_G.stringTable['default'] == null) console.error(' g_G.stringTable default fail');
        }

        var table = g_G.stringTable[locale];
        if (table == null) return null;
        return table[nic];
    }



    g_G.getLocaleStringByKeyword = function(locale, nic, keywords) {
        var str = g_G.getLocaleString(locale, nic);
        var keys = Object.keys(keywords);
        keys.forEach(k => {
            str = str.replace(k, keywords[k]);
        });
        return str;
    }


}