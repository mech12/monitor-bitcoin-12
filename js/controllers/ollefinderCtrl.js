'use strict';

module.exports = ['$http', '$scope', 'apiUrlStart', function($http, $scope, apiUrlStart) {
    $scope.txid = 'e824060f0fc79f5bb26aeac58f11b694dfdf92d9d676671016f7a44ef1bfd412';
    $scope.record = 'all';
    $scope.transaction = null;
    $scope.eOLLE_READ_LOT = function(txid, record) {
        $scope.transaction = null;
        //$scope.transaction.txid = txid;
        $http.get(apiUrlStart + '/eOLLE_READ_LOT?txid=' + txid + '&_id=' + record)
            .then(function success(res) {
                $scope.transaction={};
                $scope.transaction.data = res.data;
            });
    }
}];


