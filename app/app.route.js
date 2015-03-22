/*global app */
/*jslint */

app.config(['$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {
        'use strict';

        $stateProvider
            .state("servers", {
                url: "/",
                templateUrl: "app/components/servers/view.html",
                controller: "servers",
                authenticate: true
            }).state("login", {
                url: "/login",
                templateUrl: "app/components/login/view.html",
                controller: "login",
                authenticate: true
            });

        $urlRouterProvider.otherwise("/");
    }]);
