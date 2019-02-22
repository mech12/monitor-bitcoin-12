'use strict';

require("angular");
require("@uirouter/angularjs");
var config = require("config");
var socketio = require("angular-socket-io");

if (process.env.OLLE_API_URL) {
    window.g_G.olle_api_url = process.env.OLLE_API_URL;
    console.log('changed window.g_G.olle_api_url = ', window.g_G.olle_api_url);
}
else
	console.log('window.g_G.olle_api_url = ', window.g_G.olle_api_url);


var app = angular.module(config.get('Client.appName'),
    ['ui.router',
        'btford.socket-io',

    ]
);

require("./directives");
require("./controllers");
require("./filters");
require("./services");

app.config(require("./states"));
app.constant('apiUrlStart', config.get('Client.apiUrlStart'));


app.controller('monitorCtrl', ['$http', '$scope', 'apiUrlStart', function($http, $scope, apiUrlStart) {
    g_G = window.g_G;
    $scope.g_G = g_G;



}]);