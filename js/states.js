
'use strict';

module.exports = ["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/ollefinder");

    $stateProvider
        .state("overview", {
            url: "/overview",
            templateUrl: "/templates/overview.html",
            controller: require("./controllers/overviewCtrl"),
            controllerAs: "overviewCtrl"
        })
        .state("mempool", {
            url: "/mempool",
            templateUrl: "/templates/mempool.html",
            controller: require("./controllers/mempoolCtrl")
        })
        .state("ollefinder", {
            url: "/ollefinder",
            templateUrl: "/templates/ollefinder.html",
            controller: require("./controllers/ollefinderCtrl")
        })
        .state("blockexplorer", {
            url: "/blockexplorer",
            templateUrl: "/templates/blockexplorer.html",
            controller: require("./controllers/blockExplorerCtrl")
        })
        .state("txexplorer", {
            url: "/txexplorer",
            templateUrl: "/templates/txexplorer.html",
            controller: require("./controllers/txexplorerCtrl")
        })
        .state("blockfinder", {
            url: "/blockfinder",
            templateUrl: "/templates/blockfinder.html",
            controller: require("./controllers/blockfinderCtrl")
        })
        .state("ollewrite", {
            url: "/ollewrite",
            templateUrl: "/templates/ollewrite.html",
            controller: require("./controllers/ollewriteCtrl")
        })
        .state("login", {
            url: "/login",
            templateUrl: "/templates/login.html",
            controller: require("./controllers/loginCtrl")
        })
        .state("regist", {
            url: "/regist",
            templateUrl: "/templates/regist.html",
            controller: require("./controllers/registCtrl")
        })
        .state("about", {
            url: "/about",
            templateUrl: "/templates/about.html" //,
            //controller: require("./controllers/about")
        });
}];

