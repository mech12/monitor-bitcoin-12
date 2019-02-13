'use strict';

module.exports = ['$http', '$scope', 'apiUrlStart', function($http, $scope, apiUrlStart) {
    $scope.txid = 'c0882992e10d414a8fa998931cb0178d0f9cf8fadc18beac5f6e7d262900ccaa';
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