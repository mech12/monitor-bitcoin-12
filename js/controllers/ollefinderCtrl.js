// 'use strict';

g_G.ollefinderData.searchDate = null;
g_G.ollefinderData.searchString = null;
g_G.ollefinderData.EOlleDataType = [];
g_G.ollefinderData.eOLLE_FIND = null;

g_G.ollefinderData.categoryCurr = null;

g_G.ollefinderData.EOlleDataType = Object.keys(g_G.ollefinderData.category);
g_G.ollefinderData.categoryCurr = g_G.ollefinderData.EOlleDataType[0];
g_G.ollefinderData.searchOption1 = '--------';
// v = v.concat();
// g_G.ollefinderData.category2 = v.filter(function(d) {return d != g_G.ollefinderData.searchOption1;});
// g_G.ollefinderData.searchOption2 = null;//g_G.ollefinderData.category2[0];

g_G.ollefinderData.txid = 'c40512a47e19f60d828c90e7cd74e74a2321df17a0de5e66e4add9338fe6e88f';
g_G.ollefinderData.record = '5c6a81b578f5d17464653b85';


module.exports = ['$http', '$scope', 'apiUrlStart', function($http, $scope, apiUrlStart) {



    var g_G = window.g_G;
    $scope.g_G = g_G;
    $scope.json_data = g_G.ollefinderData.eOLLE_READ_LOT;

    console.log("ollefinderCtrl.js called");

    $scope.eOLLE_READ_LOT = function(txid, record) {
        $scope.json_data = {};
        $http.get(apiUrlStart + '/eOLLE_READ_LOT?txid=' + txid + '&_id=' + record)
            .then(function success(res) {
                g_G.ollefinderData.eOLLE_READ_LOT = res.data;
                $scope.json_data = res.data;
                console.log('g_G.ollefinderData.eOLLE_READ_LOT = ', g_G.ollefinderData.eOLLE_READ_LOT);

                if (res.data) {
                    g_G.ollefinderData.eOLLE_READ_LOT_olle = [];
                    var k = Object.keys(res.data.result.data);
                    k.forEach(function(key) {
                        if (key == '_id') return;
                        g_G.ollefinderData.eOLLE_READ_LOT_olle.push({ key: key, value: res.data.result.data[key] });

                    });
                }

            });
    }

    $scope.getOlleDataType = function(eOLLE_READ_LOT) {
        if (eOLLE_READ_LOT && eOLLE_READ_LOT.result) {
            switch (eOLLE_READ_LOT.result.type) {
                case 'create':
                    {
                        return "생산";
                    }
            }
        }
    }

    $scope.getCategoryByEOlleDataType = function() {
        return g_G.ollefinderData.category[g_G.ollefinderData.categoryCurr];
    }

    $scope.eOLLE_FIND = function() {

        var start;
        var end;
        if (g_G.ollefinderData.searchDate) {
            var date = g_G.ollefinderData.searchDate.toString().split(' - ');
            start = date[0].trim();
            end = date[1].trim();
        }

        g_G.ollefinderData.eOLLE_FIND = null;
        g_G.ollefinderData.json_data_eOLLE_FIND = null;
        var field = g_G.ollefinderData.searchOption1;
        field = field.trim();
        if (field == '--------') field = null;

        var category;
        if (g_G.ollefinderData.categoryCurr)
            category = g_G.ollefinderData.category_table[g_G.ollefinderData.categoryCurr]
        var query = {
            category: category,
            field: field,
            search: g_G.ollefinderData.searchString,
            skip: 0,
            count: 1000,
            start: start,
            end: end,
        }

        $http.post(g_G.olle_api_url + '/api/v3/eOLLE_FIND', query)
            .then(function success(res) {
                if (res.error) return console.error(' ', res.error);

                g_G.ollefinderData.eOLLE_FIND = res.data.ret;
                if (g_G.ollefinderData.eOLLE_FIND.length == 0) g_G.ollefinderData.eOLLE_FIND == null;

                if (g_G.ollefinderData.eOLLE_FIND) {
                    g_G.ollefinderData.eOLLE_FIND_field = field;
                }
                //console.log('g_G.ollefinderData.eOLLE_FIND = ', g_G.ollefinderData.eOLLE_FIND);

            });
    }

    $scope.click_olleDataTable = function(d) {
        //console.log('click = ', d);
        g_G.ollefinderData.json_data_eOLLE_FIND = d;
    }
    $scope.date2string = function(d) {
        var str = d.split('.')[0];
        return str.substring(0, str.length - 3);
    }

    $scope.updated_eOLLE_FIND = function() {
        //console.log("called updated_eOLLE_FIND()");
        if (g_G.ollefinderData.eOLLE_FIND == null) return;

        setTimeout(function doWork() {
            //console.log("$('#olleDataTable').DataTable", g_G.ollefinderData.eOLLE_FIND);
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

    $scope.toDataString = function(v) {
        if (g_G.isMobile()) {
            if (g_G.ollefinderData.eOLLE_FIND_field) return v[g_G.ollefinderData.eOLLE_FIND_field];
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


}];