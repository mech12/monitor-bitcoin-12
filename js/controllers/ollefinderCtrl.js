// 'use strict';
var config = require("config");


g_G.olle_finderData.searchDate = null;
g_G.olle_finderData.searchString1 = '';
g_G.olle_finderData.searchString2 = '';
g_G.olle_finderData.searchString3 = '';
g_G.olle_finderData.EOlleDataType = [];
g_G.olle_finderData.eOLLE_FIND = null;

g_G.olle_finderData.categoryCurr = null;

g_G.olle_finderData.EOlleDataType = Object.keys(g_G.olle_finderData.category_table);
g_G.olle_finderData.categoryCurr = g_G.olle_finderData.EOlleDataType[0];
g_G.olle_finderData.searchOption1 = '';
g_G.olle_finderData.searchOption2 = '';
g_G.olle_finderData.searchOption3 = '';
// v = v.concat();
// g_G.olle_finderData.category2 = v.filter(function(d) {return d != g_G.olle_finderData.searchOption1;});
// g_G.olle_finderData.searchOption2 = null;//g_G.olle_finderData.category2[0];

g_G.olle_finderData.txid = '034b3db2d7423290e5e3bfec67467254f1888d80999a44a24ba10e291cee157f';
g_G.olle_finderData.record = '5c6cd70c8e25478cfc297448';


//     http://localhost:9009/#!/ollefinder?txid=034b3db2d7423290e5e3bfec67467254f1888d80999a44a24ba10e291cee157f&record=5c6cd70c8e25478cfc297448
// http://test-olle.hansandopool.com:9009/#!/ollefinder?txid=034b3db2d7423290e5e3bfec67467254f1888d80999a44a24ba10e291cee157f&record=5c6cd70c8e25478cfc297448
module.exports = ['$http', '$scope', 'apiUrlStart',
    function($http, $scope, apiUrlStart, $uibModal) {


        var g_G = window.g_G;
        $scope.g_G = g_G;
        $scope.json_data = g_G.olle_finderData.eOLLE_READ_LOT;
        $scope.isShowJson = false;
        $scope.hideJson = function() {
            $scope.isShowJson = false;
            g_G.olle_finderData.olleTransaction = null;
        }

        $scope.update_searchOption = function(val) {
            console.log('update_searchOption=', val);
            g_G.olle_finderData.searchOption1 = val;

        }

        $scope.update_searchOption2 = function(val) {
            console.log('update_searchOption2=', val);
            g_G.olle_finderData.searchOption2 = val;

        }
        $scope.update_searchOption3 = function(val) {
            console.log('update_searchOption3=', val);
            g_G.olle_finderData.searchOption3 = val;

        }
        //console.log("ollefinderCtrl.js called");
        $scope.eOLLE_READ_LOT = function(txid, record) {
            g_G.olle_finderData.olleBlock = null;
            g_G.olle_finderData.olleTransaction = null;

            $scope.json_data = {};
            $http.get(apiUrlStart + '/eOLLE_READ_LOT?txid=' + txid + '&_id=' + record)
                .then(function success(res) {
                    g_G.olle_finderData.eOLLE_READ_LOT = res.data;
                    $scope.json_data = res.data;
                    console.log('g_G.olle_finderData.eOLLE_READ_LOT = ', g_G.olle_finderData.eOLLE_READ_LOT);

                    if (res.data) {
                        g_G.olle_finderData.eOLLE_READ_LOT_olle = [];
                        var k = Object.keys(res.data.result.data);
                        k.forEach(function(key) {
                            if (key == '_id') return;
                            g_G.olle_finderData.eOLLE_READ_LOT_olle.push({ key: key, value: res.data.result.data[key] });

                        });
                    }

                });
        }

        $scope.getOlleDataType = function(eOLLE_READ_LOT) {
            if (eOLLE_READ_LOT && eOLLE_READ_LOT.result) {
                var o = g_G.olle_finderData.category_table;
                var keys = Object.keys(o);
                var k = keys.find(function(k) {
                    return o[k] == eOLLE_READ_LOT.result.type;
                });
                if (k) return k;
                else return eOLLE_READ_LOT.result.type;
            }
        }

        $scope.getCategoryByEOlleDataType = function() {
            return g_G.olle_finderData.category[g_G.olle_finderData.categoryCurr];
        }

        $scope.eOLLE_FIND = function() {

            var start;
            var end;
            if (g_G.olle_finderData.searchDate) {
                var date = g_G.olle_finderData.searchDate.toString().split(' - ');
                start = date[0].trim();
                end = date[1].trim();
            }

            g_G.olle_finderData.eOLLE_FIND = null;
            g_G.olle_finderData.json_data_eOLLE_FIND = null;
            var category;
            if (g_G.olle_finderData.categoryCurr)
                category = g_G.olle_finderData.category_table[g_G.olle_finderData.categoryCurr]
            var query = {
                category: category,
                skip: 0,
                count: 1000,
                start: start,
                end: end,
            }

            var field = g_G.olle_finderData.searchOption1.trim();
            var searchStr = g_G.olle_finderData.searchString1.trim();
            if (field && field.length > 0 && searchStr.length > 0) {
                query.field = field;
                query.search = searchStr;
            }

            field = g_G.olle_finderData.searchOption2.trim();
            searchStr = g_G.olle_finderData.searchString2.trim();
            if (field && field.length > 0 && searchStr.length > 0) {
                query.field2 = field;
                query.search2 = searchStr;
            }

            field = g_G.olle_finderData.searchOption3.trim();
            searchStr = g_G.olle_finderData.searchString3.trim();
            if (field && field.length > 0 && searchStr.length > 0) {
                query.field3 = field;
                query.search3 = searchStr;
            }

            console.log('query=', query);
            $http.post(g_G.olle_api_url + '/api/v3/eOLLE_FIND', query)
                .then(function success(res) {
                    if (res.error) return console.error(' ', res.error);

                    g_G.olle_finderData.eOLLE_FIND = res.data.ret;
                    if (g_G.olle_finderData.eOLLE_FIND.length == 0) g_G.olle_finderData.eOLLE_FIND == null;

                    if (g_G.olle_finderData.eOLLE_FIND) {
                        g_G.olle_finderData.eOLLE_FIND_field = field;
                    }
                    //console.log('g_G.olle_finderData.eOLLE_FIND = ', g_G.olle_finderData.eOLLE_FIND);

                });
        }

        $scope.click_olleDataTable = function(d) {
            //console.log('click = ', d);
            g_G.olle_finderData.olleTransaction = null;
            g_G.olle_finderData.json_data_eOLLE_FIND = d;
            $scope.isShowJson = true;
            return;
        }
        $scope.date2string = function(d) {
            return d;
            // var str = d.split('.')[0];
            // return str.substring(0, str.length - 3);
        }

        $scope.updated_eOLLE_FIND = function() {
            //console.log("called updated_eOLLE_FIND()");
            if (g_G.olle_finderData.eOLLE_FIND == null) return;

            setTimeout(function doWork() {
                //console.log("$('#olleDataTable').DataTable", g_G.olle_finderData.eOLLE_FIND);
                var table = $('#olleDataTable').DataTable();

                /*
                            $('#olleDataTable').DataTable({
                                "paging": true,
                                "lengthChange": false,
                                "searching": true,
                                "ordering": true,
                                "info": true,
                                "autoWidth": false
                            });
                            */

            }, 0);

        }

        $scope.getShortdString = function(txid) {

            if (txid && g_G.isMobile()) {
                return txid.substring(0, 15) + '...';
            }
            return txid;
        }

        $scope.toDataString = function(v) {
            if (g_G.isMobile()) {
                if (g_G.olle_finderData.eOLLE_FIND_field) return v[g_G.olle_finderData.eOLLE_FIND_field];
                return '...';
            }

            var d = [];
            Object.keys(v).forEach(function(k) {
                if (k == 'txid') return;
                if (k == '_id') return;
                if (k == 'id') return;
                if (v[k].length == 0) return;
                d.push(v[k]);

            });
            var str = JSON.stringify(d).replace(/"/gi, " ");
            return str;
        }

        $scope.showTx = function(txid) {
            g_G.olle_finderData.olleBlock = null;
            console.log('showTx');
            if (g_G.olle_finderData.olleTransaction == null) {

                $http.get(apiUrlStart + '/getrawtransaction/' + txid)
                    .then(function success(res) {
                        g_G.olle_finderData.olleTransaction = res.data;
                        g_G.olle_finderData.olleBlockHash = res.data.blockhash;
                    });
            } else {
                g_G.olle_finderData.olleTransaction = null;
            }
        }

        $scope.showBlock = function(txid) {
            if (g_G.olle_finderData.olleBlock) return;
            var url = apiUrlStart + '/getblock/' + txid;
            $http.get(url)
                .then(function success(res) {
                    console.log('showBlock : ', res.data);
                    g_G.olle_finderData.olleBlock = res.data;
                });

        }

        var rq = g_G.queryString();
        if (rq.txid && rq.record) {
            g_G.olle_finderData.txid = rq.txid;
            g_G.olle_finderData.record = rq.record;

            $('#tab_txid_header').addClass('active');
            $('#tab_txid').addClass('active');
            $('#tab_category_header').removeClass('active');
            $('#tab_category').removeClass('active');

            $scope.eOLLE_READ_LOT(rq.txid, rq.record);
        }

    }
];