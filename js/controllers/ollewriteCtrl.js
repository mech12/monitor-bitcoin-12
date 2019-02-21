'use strict';

var csvtojson = require('csvtojson');


module.exports = ['$http', '$scope', 'apiUrlStart', function($http, $scope, apiUrlStart) {

    var g_G = window.g_G;
    $scope.g_G = g_G;
    $scope.rq = {
        category: g_G.olle_finderData.EOlleDataType[0],
    };

    $scope.send_eOLLE_WRITE_MULTY = function() {
        var rq = $scope.rq;
        if (g_G.checkString(rq, 'category')) return;
        if (g_G.checkString(rq, 'csv')) return;

        rq.category = g_G.olle_finderData.category_table[rq.category];


        csvtojson({ delimiter: '\t' })
            .fromString(rq.csv)
            .then(function(jsonObj) {
                if (jsonObj == null) return g_G.toastr.error(' csvtosjon parse error', "write FAIL");
                if (jsonObj.length <= 0) return g_G.toastr.error('[jsonObj.length >=1]', "write FAIL");

                console.log('jsonObj = ', jsonObj);
                send_data({ type: rq.category, data: jsonObj });
            });
    }

    function send_data(rq) {

        $http.post(g_G.olle_api_url + '/api/v3/eOLLE_WRITE_MULTY', rq)
            .then(function success(res) {
                if (res.error) {
                    g_G.toastr.error('네트웍 에러', "처리 실패.");
                    return console.error('error 1',res.error);
                }
                var rs = res.data;
                if (rs.error) {
                    g_G.toastr.error('네트웍 에러', "처리 실패.");
                    return console.error('error 2',rs.error);
                }

                g_G.toastr.success('전송 성공', "DB 캐싱이 되었습니다.");
                console.log('eOLLE_WRITE_MULTY ', rs);
            });
    }

}];