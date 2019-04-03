'use strict';

var csvtojson = require('csvtojson');


module.exports = ['$http', '$scope', 'apiUrlStart', function($http, $scope, apiUrlStart) {

    var g_G = window.g_G;
    $scope.g_G = g_G;
    $scope.rq = {
        categoryOrg: "olleVersion2",
    };

    var CSV_ROW_START = 2;


    $scope.convertToOlleJSON = function() {
        if ($scope.rq.csv == null) return;

        var csvList = $scope.rq.csv.split('\n').map(function(c) {
            return c.split('\t');
        });

        var fields = [];
        var category1;
        for (var i = 0; i < csvList[0].length; ++i) {
            var c0 = csvList[0][i];
            if (c0.length != 0) category1 = c0;
            var c1 = csvList[1][i];
            if (c1.length == 0)
                fields.push(category1);
            else
                fields.push([category1, c1]);

        }

        console.log('fields=', fields);
        var olleDataList = {};
        var lotField = fields[0];
        if (typeof lotField != 'string') return console.error("324 typeof fields[0] !='string'");

        var lot = null; //현제 LOT 번호.
        var olleData = null;
        for (var i = CSV_ROW_START; i < csvList.length; ++i) {
            var csv = csvList[i];
            console.log('csv=', csv);
            if (csv[0].length > 0) lot = csv[0];

            if (olleDataList[lot] == null) { // new olle data record
                olleDataList[lot] = {};
                olleData = olleDataList[lot];
                olleData[lotField] = lot;
            }
            olleData = olleDataList[lot];

            var prevCategory = null;
            var categoryData = {};
            if (csv.length <= 1) continue;
            if (fields.length != csv.length) {
                console.error('fields', fields, 'csv', csv);
                return console.error('98 fields.length!=csv.length');
            }
            for (var fieldIdx = 1; fieldIdx < fields.length; ++fieldIdx) {

                var field = fields[fieldIdx];
                if (Array.isArray(field) == false) return console.error("324 Array.isArray(field)==false");
                if (field.length != 2) return console.error("field.length!=2");

                var currCategory = field[0].trim();
                var f2 = field[1].trim();

                if (prevCategory == null) {
                    prevCategory = currCategory;
                }
                var currFieldData = csv[fieldIdx]
                console.log('currFieldData=', currFieldData, 'currCategory=[' + currCategory + '] prevCategory=[' + prevCategory + '] f2=', f2);

                if (olleData[prevCategory] == null) {
                    olleData[prevCategory] = [];
                }

                if (prevCategory != currCategory) {
                    if (Object.keys(categoryData).length > 0) {
                        console.log('push1', 'currCategory=', currCategory, 'prevCategory=', prevCategory, categoryData);
                        olleData[prevCategory].push(categoryData);
                    }
                    categoryData = {};
                    prevCategory = currCategory;
                }
                if (currFieldData.length > 0)
                    categoryData[f2] = currFieldData;

            }
            if (Object.keys(categoryData).length > 0) {
                console.log('push2', prevCategory, categoryData);
                olleData[prevCategory].push(categoryData);
            }
        }
        $scope.rq.json = Object.values(olleDataList);
        if ($scope.rq.json && $scope.rq.json.length > 0)
            $scope.isWriteBlockChain = true;

    }


    $scope.send_eOLLE_WRITE_MULTY_VER2 = function() {
        if ($scope.rq.json == null) return console.error('$scope.rq.json==null');
        var rq = { type: $scope.rq.categoryOrg, data: $scope.rq.json }

        $http.post(g_G.olle_api_url + '/api/v3/eOLLE_WRITE_MULTY', rq)
            .then(function success(res) {
                if (res.error) {
                    g_G.toastr.error('네트웍 에러', "처리 실패.");
                    return console.error('error 1', res.error);
                }
                var rs = res.data;
                if (rs.error) {
                    g_G.toastr.error('네트웍 에러', "처리 실패.");
                    return console.error('error 2', rs.error);
                }

                g_G.toastr.success('전송 성공', "DB 캐싱이 되었습니다.");
                console.log('eOLLE_WRITE_MULTY ', rs);
            });

    }

    $scope.send_eOLLE_WRITE_MULTY = function() {
        var rq = $scope.rq;
        if (g_G.checkString(rq, 'categoryOrg')) return;
        if (g_G.checkString(rq, 'csv')) return;

        var category = g_G.olle_finderData.category_table[rq.categoryOrg];


        csvtojson({ delimiter: '\t' })
            .fromString(rq.csv)
            .then(function(jsonObj) {
                if (jsonObj == null) return g_G.toastr.error(' csvtosjon parse error', "write FAIL");
                if (jsonObj.length <= 0) return g_G.toastr.error('[jsonObj.length >=1]', "write FAIL");

                console.log('jsonObj = ', jsonObj);
                send_data({ type: category, data: jsonObj });
            });
    }

    function send_data(rq) {

        $http.post(g_G.olle_api_url + '/api/v3/eOLLE_WRITE_MULTY', rq)
            .then(function success(res) {
                if (res.error) {
                    g_G.toastr.error('네트웍 에러', "처리 실패.");
                    return console.error('error 1', res.error);
                }
                var rs = res.data;
                if (rs.error) {
                    g_G.toastr.error('네트웍 에러', "처리 실패.");
                    return console.error('error 2', rs.error);
                }

                g_G.toastr.success('전송 성공', "DB 캐싱이 되었습니다.");
                console.log('eOLLE_WRITE_MULTY ', rs);
            });
    }

}];

