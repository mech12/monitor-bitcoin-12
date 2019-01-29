'use strict';

module.exports = ['$http', '$scope', 'apiUrlStart', function($http, $scope, apiUrlStart) {
    $scope.block = {};
    $scope.txid=0;
    $scope.searchByBlockHash = function(txid) {
        var url = apiUrlStart + '/getblock/' + txid;
        console.log('url = ', url);
        $http.get(url)
            .then(function success(res) {
                $scope.block.data = res.data;
            });
    }

    $scope.searchByBlockHeight = function(txid) {
        var url = apiUrlStart + '/getblockhash/' + txid;
        $http.get(url)
            .then(function success(res) {
                var url = apiUrlStart + '/getblock/' + res.data;
                $http.get(url)
                    .then(function success(res) {
                        $scope.block.data = res.data;
                    });

            });
    }



}];