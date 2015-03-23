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
                sp: {
                    authenticate: true
                }
            }).state("login", {
                url: "/login",
                templateUrl: "app/components/login/view.html",
                controller: "login"
            }).state("passwordResetRequest", {
                url: "/passwordResetRequest",
                templateUrl: "app/components/passwordResetRequest/view.html",
                controller: "passwordResetRequest"
            });

        $urlRouterProvider.otherwise("/");
    }]);
