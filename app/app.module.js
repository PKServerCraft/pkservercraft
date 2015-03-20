/*global angular */
/*jslint */

var app = angular.module('pkservercraft', ['ui.router']);

var API = "http://localhost:8080/pkservercraft/v1";

app.run(['$http', '$rootScope', '$state', '$q',
    function ($http, $rootScope, $state, $q) {
        'use strict';

        $rootScope.isAuthenticated = false;
        $rootScope.navbar = 'app/shared/navbar/view.html';
        $rootScope.logout = API + "/logout";
        
        function retrieveLoginDetails() {
            var deferred = $q.defer();

            $http.get(API + "/me").success(function (data, status, headers, config) {
                if (data.name !== undefined) {
                    deferred.resolve(data);
                }
            }).error(function (data, status, headers, config) {
                deferred.reject();
            });
            
            deferred.resolve();
            
            return deferred.promise;
        }

        $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
            if (toState.authenticate && !$rootScope.isAuthenticated) {
                retrieveLoginDetails().then(function (loginDetails) {
                    $rootScope.loginDetails = loginDetails;
                    $rootScope.isAuthenticated = true;
                }, function () {
                    window.location = API + "/login";
                });
            }
        });
    }]);

