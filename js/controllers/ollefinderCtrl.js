'use strict';

module.exports = ['$http', '$scope', 'apiUrlStart', function($http, $scope, apiUrlStart) {
    $scope.txid = 'b0a86740b89025c702b25a920a7b72526f76a448a5fdf20cb0ac1288d9023d6c';
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


