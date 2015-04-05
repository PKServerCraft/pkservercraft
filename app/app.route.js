/*global app */
/*jslint */

app.config(['$stateProvider', '$locationProvider', '$urlRouterProvider',
    function ($stateProvider, $locationProvider, $urlRouterProvider) {
        'use strict';

        //$locationProvider.html5Mode(true);
        $stateProvider
            .state("servers", {
                url: "/",
                templateUrl: "app/components/servers/view.html",
                controller: "servers",
                sp: {
                    authenticate: true
                }
            }).state("deployables", {
                url: "/deployables",
                templateUrl: "app/components/deployables/view.html",
                controller: "deployables",
                sp: {
                    authenticate: true
                }
            }).state("login", {
                url: "/login",
                templateUrl: "app/components/login/view.html"
            }).state("passwordResetRequest", {
                url: "/passwordResetRequest",
                templateUrl: "app/components/passwordResetRequest/view.html"
            }).state("passwordReset", {
                url: "/passwordReset?sptoken",
                templateUrl: "app/components/passwordReset/view.html"
            });

        $urlRouterProvider.otherwise("/");
    }]);
